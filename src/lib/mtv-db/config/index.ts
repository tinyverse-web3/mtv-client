export const config = {
  ipfs: {
    http_node: { url: import.meta.env.VITE_IPFS_HOST },
    //node_address: '/ip4/192.168.3.68/tcp/4001/p2p/12D3KooWCKvhKRhSGL8vbiTaYwdbpj3kRb5foMR2qfG2B4vvYHFb',
    //node_address: '/ip4/192.168.3.233/tcp/5001/',
    //create_option: {
    //repo: './mtv',
    // config: {
    //     Addresses: {
    //         Swarm: [
                //  '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                //  '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                // '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
    //         ]
    //     }
    // }
    //}
  },
  orbitdb: {
    directory: './mtv',
    onoffline: false
  },
  pinata: {
    gate_way_api: import.meta.env.VITE_PINATA_GATE_WAY_API,
    pin_cid_api:  import.meta.env.VITE_PINATA_PIN_CID_API,
    pin_json_api: import.meta.env.VITE_PINATA_PIN_JSON_API,
    pin_file_api: import.meta.env.VITE_PINATA_PIN_FILE_API,
    unpin_cid_api: import.meta.env.VITE_PINATA_UNPIN_CID_API,
    jwt_key: import.meta.env.VITE_PINATA_JWT_KEY
  },
};

export const metaData = {
  db_address: '', //use the user's public key
  db_name: '', // user
  business: '', // business type example: "notebook"
  version: 0, // Every time a record is updated, this version value is incremented by 1
  cid: '', //ipfs cid
};
