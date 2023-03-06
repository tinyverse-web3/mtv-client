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
    //         // '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
    //         // '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
    //         // '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
    //         ]
    //     }
    // }
    //}
  },
  orbitdb: {
    directory: './mtv',
    onoffline: false,
  },
  pinata: {
    gateWayApi: 'https://gateway.pinata.cloud/ipfs/',
    pinCidApi: 'https://api.pinata.cloud/pinning/pinByHash',
    pinJsonApi: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    pintFileApi: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    unpinCidApi: 'https://api.pinata.cloud/pinning/unpin',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwMDk4YjU2NC1mYjQ3LTQxOWItODFmMy0yOGI1ZGNlZjZjMTkiLCJlbWFpbCI6ImR1eW91eW91ODhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ3YTlhZmI5NGExZDg4MmZmY2NlIiwic2NvcGVkS2V5U2VjcmV0IjoiOWE3Y2RhOWRiYTRkNzhmNjI4NDJmNjliZjRhMDEzNWU1YWNjYjcwYjhjOWY0ZTFjNmQwOTk0Yjk5NmNjMWZiNyIsImlhdCI6MTY3NjM0MTIyOH0.DxCYtEw1id6zqfbWdR1TaQn71Rgt2RwyNB8ZQ95kujY',
  },
};

export const metaData = {
  db_address: '', //use the user's public key
  db_name: '', // user
  business: '', // business type example: "notebook"
  version: 0, // Every time a record is updated, this version value is incremented by 1
  cid: '', //ipfs cid
};
