import * as ipfsHttp from 'ipfs-http-client';
import OrbitDB from 'orbit-db';
import axios from 'axios';
import * as IPFS from 'ipfs';
import { config } from './config';
import { Logger } from 'tslog';
import { keys, PrivateKey, PublicKey, aes } from 'libp2p-crypto';
import * as Name from 'w3name';
import ipfsLog from 'ipfs-log';
import CryptoJS from 'crypto-js';

const logger = new Logger({ name: 'mtvDb' });

export class MtvDb {
  userPrivateKey!: PrivateKey;
  userPrivateKeyStr!: string;
  userPublicKey!: PublicKey;
  userPublicKeyStr!: string;
  dbAddress = '';
  dbSnapshortCid!: string;
  ipfs: any;
  orbitdb: any;
  kvdb: any;
  newUser: boolean = false;
  dbName!: string;
  metadata: any;
  metadataKey!: string;
  metadataCid!: string;
  metadataRecord: any;
  isNew: boolean = true;
  w3name: any;
  aesIv!: any;
  aesKey!: any;
  dbInitKeyName: string = 'k0';
  dbRestoreKeyName: string = 'k1';

  // Private instance, which cannot be directly accessed by the outside world
  private static mtvDbInstance: MtvDb;

  public count = 0;

  constructor() {
    logger.info('MmtDb init...');
  }

  public static getInstance() {
    if (this.mtvDbInstance) {
      return this.mtvDbInstance;
    }
    this.mtvDbInstance = new MtvDb();
    return this.mtvDbInstance;
  }

  public async createInstance(
    privateKey: string,
    dbAddress: string = '',
    metadataKey: string = '',
  ) {
    const privKey =
      await keys.supportedKeys.secp256k1.unmarshalSecp256k1PrivateKey(
        Buffer.from(privateKey, 'hex'),
      );
    this.userPrivateKeyStr = privateKey;
    this.userPrivateKey = privKey;
    this.userPublicKey = privKey.public;
    this.userPublicKeyStr = Buffer.from(this.userPublicKey.bytes).toString(
      'hex',
    );
    this.dbName =  this.userPublicKeyStr + '_kv' ; // default db name, mtv is app name and kv is db type for keyvalue
    this.metadataKey = metadataKey;
    if (this.metadataKey != '') {
      this.isNew = false;
    }
    this.metadataCid = '';
    this.dbSnapshortCid = '';
    this.metadata = {};
    this.dbAddress = dbAddress;
    await this.initMetaDataKey(this.userPrivateKey, this.userPublicKeyStr);
    await this.initAes(this.userPrivateKeyStr);
    try {
      await this.initKvDb();
      logger.info('db address: ' + this.dbAddress);
    } catch (err) {
      logger.error((err as Error).message)
      this.closeDb();
      throw err;
    }
  }

  public async initAes(privateKeyStr: string) {
    this.aesIv = CryptoJS.enc.Utf8.parse(privateKeyStr.slice(-16));
    this.aesKey = CryptoJS.enc.Utf8.parse(privateKeyStr);
  }

  aesEncode(data: string) {
    let srcs = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(srcs, this.aesKey, {
      iv: this.aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let encryptedBase64Data = CryptoJS.enc.Base64.stringify(
      encrypted.ciphertext,
    );
    return encodeURIComponent(encryptedBase64Data);
  }

  aesDecode(cryptData: string) {
    cryptData = decodeURIComponent(cryptData);
    let encryptedHexStr = CryptoJS.enc.Base64.parse(cryptData);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, this.aesKey, {
      iv: this.aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

  public async initKvDb() {
    await this.initIpfs();
    await this.initOrbitDB();

    if (this.kvdb) {
      logger.warn('kvdb has been initialized');
      return;
    }
    await this.getKvDb(this.dbAddress);
    console.log(this.isNew);
    if (this.isNew) {
      await this.kvdb.put(this.dbInitKeyName, new Date().toString(), {
        pin: true,
      });
    }
    if (!this.isNew && !this.isThereAkey(this.dbInitKeyName)) {
      try {
        await this.restoreDb();
      } catch (err) {
        logger.warn('orginal db data: ' + this.kvdb.all);
        logger.error('data restore error:');
        logger.error((err as Error).message);
      }
    }
    this.dbAddress = this.kvdb.id;

    // if(!this.isNew && (this.dbAddress !=  this.kvdb.id)){
    //     throw new Error("The local db address is not equal to metadata's db address, please chekc!");
    // }
  }

  async restoreDb() {
    logger.warn(
      'db address is null or db Data is null, need to restore whole db data',
    );
    await this.getMetaData(this.metadataKey);
    this.metadataRecord = this.metadata[this.dbName];
    this.dbSnapshortCid = this.metadataRecord.db_cid;
    await this.restoreDbData(this.dbSnapshortCid);
  }

  private isThereAkey(key: string): boolean {
    if (this.kvdb.get(key)) {
      return true;
    }
    return false;
  }

  sleep = (waitTime: number) =>
    new Promise((resolve) => setTimeout(() => resolve(true), waitTime));

  public async getMetaData(metadataKey: string) {
    this.metadataCid = await this.getMetaCidByKey(this.metadataKey);
    this.metadata = await this.downloadMetaData(this.metadataCid);
  }

  public async put(key: string, value: string) {
    const encryptData = await this.aesEncode(value);
    return await this.kvdb.put(key, encryptData, { pin: true });
  }

  public async get(key: string) {
    const encryptData = this.kvdb.get(key);
    const decryptData = await this.aesDecode(encryptData);
    return decryptData;
  }

  public async del(key: string) {
    return this.kvdb.del(key);
  }

  public getAll() {
    return this.kvdb.all;
  }

  public async backupDb() {
    const snapshotData = this.kvdb.all;
    let oldMetataCid, oldMetadataRecord, oldDbSnapshortCid;
    try {
      if(!this.isNew){
        await this.getMetaData(this.metadataKey);
        //get old metadataCid and old dbSnapshortCid for del process
        oldMetataCid = this.metadataCid;
        oldMetadataRecord = this.metadata[this.dbName];
        oldDbSnapshortCid = oldMetadataRecord.db_cid;
      }
    } catch (error) {}

    const newDbSnapshortCid = await this.uploadDbSnapshot(
      this.kvdb.id,
      snapshotData,
    );
    this.dbSnapshortCid = newDbSnapshortCid;
    const newMetaInfo = await this.updateMetaDataForUser(
      this.metadata,
      this.dbName,
      this.dbAddress,
      newDbSnapshortCid,
    );
    if (newMetaInfo) {
      this.metadata = newMetaInfo.metatdata;
      this.metadataCid = newMetaInfo.cid;
      await this.updateMetaDataKeyMap(this.w3name, this.metadataCid);
      if (oldDbSnapshortCid && oldDbSnapshortCid != newDbSnapshortCid) {
        await this.delFileFromPinata(oldDbSnapshortCid); // Delete old backups to free up space
      }
      if (oldMetataCid && oldMetataCid != this.metadataCid) {
        await this.delFileFromPinata(oldMetataCid); // Delete old backups to free up space
      }
    }
  }

  public async closeDb() {
    if (this.orbitdb) {
      //await this.orbitdb.stop();
    }
    // if(this.ipfs){
    //     await this.ipfs.stop();
    // }
  }

  private async restoreDbData(dbSnapshotCid: string) {
    const snapshotData = await this.downloadFileFromPinata(dbSnapshotCid);
    await Object.entries(snapshotData).forEach(async ([k, v]) => {
      console.log(k, v);
      await this.kvdb.put(k, v, { pin: true });
    });
    await this.kvdb.put(this.dbRestoreKeyName, new Date().toString(), {
      pin: true,
    });
    if (!this.isThereAkey(this.dbInitKeyName)) {
      await this.kvdb.put(this.dbInitKeyName, new Date().toString(), {
        pin: true,
      });
    }
  }

  private async initIpfs(option = {}) {
    logger.info('Init the ipfs instance');
    //this.ipfs = await IPFS.create(option);
    if (this.ipfs) {
      logger.warn('ipfs has been initialized');
      await this.sleep(2);
      return;
    }
    this.ipfs = await ipfsHttp.create(config.ipfs.http_node);
    // const identity = await this.ipfs.id();
    // logger.info("ipfs id: " + identity.string);
  }

  private async initOrbitDB() {
    logger.info('Init the OrbitDB instance');
    if (this.orbitdb) {
      await this.sleep(3);
      logger.warn('orbitdb has been initialized');
      return;
    }
    //config.orbitdb.peerId = this.userPublicKeyStr;
    this.orbitdb = await OrbitDB.createInstance(this.ipfs, config.orbitdb);
  }

  async getMetaCidByKey(metadataKey: string) {
    const getName = Name.parse(metadataKey);
    const getRevision = await Name.resolve(getName);
    const cid = await getRevision.value;
    return cid;
  }

  async downloadMetaData(metadataCid: string) {
    let metadataContent = {};
    try {
      metadataContent = await this.downloadFileFromPinata(metadataCid);
    } catch (err) {
      //setTimeout("pause for next download", 1000);
      //retry one time
      logger.warn('download again');
      metadataContent = await this.downloadFileFromPinata(metadataCid);
    }
    return metadataContent;
  }

  async initMetaDataKey(privateKey: PrivateKey, pubKeyStr: string) {
    if (this.w3name) {
      logger.warn('w3name has been initialized');
      this.sleep(2);
      return;
    }
    const name = new Name.WritableName(privateKey);
    this.w3name = name;
    const revision = await Name.v0(name, pubKeyStr); // inita the ipns key
    try {
      await Name.publish(revision, name.key);
    } catch (err) {
      logger.warn('inpns name init error: ' + (err as Error).message);
    }
    this.metadataKey = name.toString();
    logger.info('created new name: ', name.toString());
  }

  async updateMetaDataKeyMap(w3name: any, newCid: string) {
    const revision = await Name.resolve(w3name);
    const nextRevision = await Name.increment(revision, newCid);
    await Name.publish(nextRevision, w3name.key);
  }

  async getKvDb(address: string, options?: any) {
    let dbOption = {
      sync: true,
      create: true,
      overwrite: false,
      type: 'keyvalue', //default for keyvalue db
      accessController: { write: ['*'] },
    };
    if (this.isNew || this.dbAddress == '') {
      // For new users who do not have a database at initialization time, a default database name will be set for to create operate
      address = this.dbName;
    }
    if (this.kvdb) {
      logger.warn('kvdb has been initialized');
      return;
    }
    try {
      this.kvdb = await this.orbitdb.open(address, dbOption);
      console.log(this.kvdb);
    } catch (err) {
      logger.warn('open db again');
      console.log(err);
      return;
    }
    await this.kvdb.load();
    return this.kvdb;
  }

  async updateMetaDataForUser(
    metadata: any,
    dbName: string,
    dbAddress: string,
    dbSnapshotCid: string,
  ) {
    const defaultBusiness = 'mtv';
    let version = 0;
    const metadataLength = Object.keys(metadata).length;
    if (metadataLength >= 1) {
      version = metadata.version + 1;
    }
    const updateRecord = {
      db_name: dbName, // db name when init db
      db_address: dbAddress,
      business: defaultBusiness,
      version: version, // Every time a record is updated, this version value is incremented by 1
      db_cid: dbSnapshotCid, //ipfs cid
      status: 'update',
    };
    metadata[dbName] = updateRecord;
    const newMetaCid = await this.uploadMetaFileToPinata(metadata);
    const newMetaDtaInof = {
      cid: newMetaCid,
      metatdata: metadata,
    };
    return newMetaDtaInof;
  }

  async uploadMetaFileToPinata(jsonData: any) {
    const metadataName = this.userPublicKeyStr + '.json';
    const pinataMetadata = {
      name: metadataName,
      keyvalues: {
        metadata_name: metadataName,
      },
    };
    const result = await this.uploadJsonFileToPinata(pinataMetadata, jsonData);
    const newCid = result.IpfsHash;
    return newCid;
  }

  async uploadDbSnapshot(dbAddress: string, jsonData: any) {
    const pinataMetadata = {
      name: dbAddress,
      keyvalues: {
        db_address: dbAddress,
      },
    };
    const result = await this.uploadJsonFileToPinata(pinataMetadata, jsonData);
    return result.IpfsHash;
  }

  async uploadJsonFileToPinata(pinataMetadata: object, jsonData: object) {
    const httpConfig = {
      headers: {
        Authorization: 'Bearer ' + config.pinata.jwt_key,
        'Content-Type': 'application/json',
      },
    };
    const pinataJsonData = {
      pinataMetadata: pinataMetadata,
      pinataContent: jsonData,
    };
    let result = {};
    return axios
      .post(config.pinata.pin_json_api, pinataJsonData, httpConfig)
      .then((res) => {
        logger.info(res.data);
        return res.data;
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  }

  async downloadFileFromPinata(fileCid: string) {
    const httpConfig = {
      headers: {
        Accept: 'text/plain',
      },
    };
    const fileUrl = config.pinata.gate_way_api + fileCid;
    return axios
      .get(fileUrl, httpConfig)
      .then((res) => {
        logger.info(res.data);
        return res.data;
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  }

  async delFileFromPinata(fileCid: string) {
    const httpConfig = {
      headers: {
        Authorization: 'Bearer ' + config.pinata.jwt_key,
      },
    };
    const fileUrl = config.pinata.unpin_cid_api + '/' + fileCid;
    return axios
      .delete(fileUrl, httpConfig)
      .then((res) => {
        logger.info(res);
      })
      .catch((err) => {
        logger.error(err);
      });
  }
}

const mtvDb = new MtvDb();
export default mtvDb;
