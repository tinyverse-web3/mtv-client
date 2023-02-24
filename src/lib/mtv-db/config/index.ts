export const config = {
    ipfs: {
       node_url: "http://192.168.0.6:5001/api/v0",
       create_option: {
        repo: './mtv',
        EXPERIMENTAL: { pubsub: true },
       }
    },
    orbitdb: {
        directory: "./mtv",
        peeerId: "mtv" //this is a default id, please use the public key of user
    },
    pinata: {
        "gateWayApi": "https://gateway.pinata.cloud/ipfs/",
        "pinCidApi": "https://api.pinata.cloud/pinning/pinByHash",
        "pinJsonApi": "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        "pintFileApi": "https://api.pinata.cloud/pinning/pinFileToIPFS",
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwMDk4YjU2NC1mYjQ3LTQxOWItODFmMy0yOGI1ZGNlZjZjMTkiLCJlbWFpbCI6ImR1eW91eW91ODhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ3YTlhZmI5NGExZDg4MmZmY2NlIiwic2NvcGVkS2V5U2VjcmV0IjoiOWE3Y2RhOWRiYTRkNzhmNjI4NDJmNjliZjRhMDEzNWU1YWNjYjcwYjhjOWY0ZTFjNmQwOTk0Yjk5NmNjMWZiNyIsImlhdCI6MTY3NjM0MTIyOH0.DxCYtEw1id6zqfbWdR1TaQn71Rgt2RwyNB8ZQ95kujY"
    }
}

export const metaData = {
    "db_address": "", //use the user's public key
    "db_name": "", // user
    "business": "", // business type example: "notebook" 
    "version": 0, // Every time a record is updated, this version value is incremented by 1
    "cid": "" //ipfs cid
}