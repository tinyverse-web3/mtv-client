//'import  { create } from 'ipfs-http-client'
import OrbitDB from 'orbit-db';
import axios from 'axios';
import * as IPFS from 'ipfs';
import { config } from './config';
import { Logger } from 'tslog';
import { keys, PrivateKey, PublicKey, aes } from 'libp2p-crypto';
import * as Name from 'w3name';
import ipfsLog from 'ipfs-log';

const logger = new Logger({ name: 'mtvDb' });

export class MtvDb {
  userPrivateKey!: PrivateKey;
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
  crypt!: aes.Cipher;
  aesInv!: string;

  //  constructor(privateKey: string, dbAddress:string = '', metadataKey: string = '') {
  //     this.createInstance(privateKey, dbAddress, metadataKey);
  // }

  public async createInstance(
    privateKey: string,
    dbAddress: string = '',
    metadataKey: string = '',
  ) {
    const privKey =
      await keys.supportedKeys.secp256k1.unmarshalSecp256k1PrivateKey(
        Buffer.from(privateKey, 'hex'),
      );
    this.userPrivateKey = privKey;
    this.userPublicKey = privKey.public;
    this.userPublicKeyStr = Buffer.from(this.userPublicKey.bytes).toString(
      'hex',
    );
    this.dbName = 'mtv' + '.kv'; // default db name, mtv is app name and kv is db type for keyvalue
    this.metadataKey = metadataKey;
    if (this.metadataKey != '') {
      this.isNew = false;
    }
    this.metadataCid = '';
    this.dbSnapshortCid = '';
    this.metadata = {};
    this.dbAddress = dbAddress;
    try {
      await this.initKvDb();
      logger.info('db address: ' + this.dbAddress);
    } catch (err) {
      console.log(err);
      this.closeDb();
      throw err;
    }
    await this.initMetaDataKey(this.userPrivateKey, this.userPublicKeyStr);
    // await this.initAes(this.userPrivateKey, this.userPublicKey)
  }

  public async initAes(privateKey: PrivateKey, publicKey: PublicKey) {
    this.aesInv = this.userPublicKeyStr.slice(-16);
    const inv = Buffer.from(this.aesInv);
    this.crypt = await aes.create(privateKey.bytes, inv);
  }

  public async initKvDb() {
    await this.initIpfs(config.ipfs.create_option);
    await this.initOrbitDB(this.userPublicKeyStr);
    if (!this.isNew) {
      this.metadataCid = await this.getMetaCidByKey(this.metadataKey);
      this.metadata = await this.downloadMetaData(this.metadataCid);
      this.metadataRecord = this.metadata[this.dbAddress];
      this.dbAddress = this.metadataRecord.db_address;
      this.dbSnapshortCid = this.metadataRecord.db_cid;
    }
    if (!this.isNew && this.dbAddress == '') {
      logger.error('db address is null, please check');
      throw new Error('db address is null, please check');
    }
    this.kvdb = await this.getKvDb(this.dbAddress);
    await this.kvdb.load();
    if (!this.isNew && this.dbAddress != this.kvdb.id) {
      throw new Error(
        "The local db address is not equal to metadata's db address, please chekc!",
      );
    }
    this.dbAddress = this.kvdb.id;
    if (!this.isNew && this.kvdb._oplog.length <= 0) {
      await this.mergeDbLog(this.dbSnapshortCid);
    }
  }

  public async put(key: string, value: string) {
    // const encryptData = await this.crypt.encrypt(Buffer.from(value, 'utf-8'))
    // return this.kvdb.put(key, encryptData);
    return await this.kvdb.put(key, value);
  }

  public async get(key: string) {
    // const encryptData = this.kvdb.get(key);
    // const decryptData = await this.crypt.decrypt(encryptData)
    // return decryptData;
    console.log(this.kvdb);
    return this.kvdb.get(key);
  }

  public del(key: string) {
    return this.kvdb.del(key);
  }

  public getAll() {
    return this.kvdb.all;
  }

  public async backupDb() {
    const snapshotData = await this.kvdb._oplog.toSnapshot();
    const newCid = await this.uploadDbSnapshot(this.kvdb.id, snapshotData);
    this.dbSnapshortCid = newCid;
    const newMetaInfo = await this.updateMetaDataForUser(
      this.metadata,
      this.dbName,
      this.dbAddress,
      newCid,
    );
    if (newMetaInfo) {
      this.metadata = newMetaInfo.metatdata;
      this.metadataCid = newMetaInfo.cid;
      await this.updateMetaDataKeyMap(this.w3name, this.metadataCid);
    }
  }

  public async closeDb() {
    if (this.orbitdb) {
      await this.orbitdb.stop();
    }
    if (this.ipfs) {
      await this.ipfs.stop();
    }
  }

  private async mergeDbLog(dbSnapshotCid: string) {
    const snapshotData = await this.downloadFileFromPinata(dbSnapshotCid);
    const kvdbLog = await ipfsLog.fromJSON(
      this.ipfs,
      this.kvdb.identity,
      snapshotData,
      {
        length: -1,
        timeout: 100000,
      },
    );
    await this.kvdb._oplog.join(kvdbLog);
    await this.kvdb._updateIndex();
    await this.kvdb.load();
  }

  private async initIpfs(option = {}) {
    logger.info('Init the ipfs instance');
    this.ipfs = await IPFS.create(option);
    const identity = await this.ipfs.id();
    logger.info('ipfs id: ' + identity.string);
  }

  private async initOrbitDB(dbId: string) {
    logger.info('Init the OrbitDB instance');
    config.orbitdb.peeerId = dbId;
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
      setTimeout('pause for next download', 1000);
      //retry one time
      logger.warn('download again');
      metadataContent = await this.downloadFileFromPinata(metadataCid);
    }
    return metadataContent;
  }

  async initMetaDataKey(privateKey: PrivateKey, pubKeyStr: string) {
    //w3name
    const name = new Name.WritableName(privateKey);
    this.w3name = name;
    const revision = await Name.v0(name, pubKeyStr); // inita the ipns key
    await Name.publish(revision, name.key);
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
      meta: { db_id: this.orbitdb.identity.id },
    };
    if (this.isNew && this.dbAddress == '') {
      // For new users who do not have a database at initialization time, a default database name will be set for to create operate
      address = this.dbName;
    }
    const db = await this.orbitdb.open(address, dbOption);
    return db;
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
    metadata[dbAddress] = updateRecord;
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
        Authorization: 'Bearer ' + config.pinata.jwt,
        'Content-Type': 'application/json',
      },
    };
    const pinataJsonData = {
      pinataMetadata: pinataMetadata,
      pinataContent: jsonData,
    };
    let result = {};
    return axios
      .post(config.pinata.pinJsonApi, pinataJsonData, httpConfig)
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
    const fileUrl = config.pinata.gateWayApi + fileCid;
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
}
