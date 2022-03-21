<p align="center"><img src="demo-img/platform.png" width="550px"></p>

# OnlineEventsPlatform

Online Event Platform is a dApp deployed on the <ins>Aurora Testnet EVM</ins> chain where the platform organizer can host multiple online events with some options, one of which is an option that allows to watch the live stream of event only those users who have a special pass - "NFT Events Pass" . At the moment, this pass can be minted on dapp for free.


### Demonstration:

1. Website live: TBD
2. Video demo: TBD


### DApp features:

- Only the thorganizer of platform can create / modify online events;
- The organizer can choose the type of access to the events live streams: with NFT or without NFT pass;
- Users can mint "NFT Events Pass" for free;
- Responsive design;


### How to deploy dApp:

1. Clone this repository.
2. Go to <ins>scripts</ins> folder and open <ins>config.js</ins> file.
3. Set constants:
    * `OWNER` - Address of contracts creator
    * `EVENTS_CONTRACT_ADDRESS` - Events contract address
    * `EVENTS_CONTRACT_ABI` - Events contract ABI
    * `EVENTS_NFT_CONTRACT_ADDRESS` - NFT contract address 
    * `EVENTS_NFT_CONTRACT_ABI` - NFT contract ABI
    * `RPC` - Chain RPC
    * `CHAIN_NAME` - Chain name
    * `CHAIN_ID` - Chain ID

### To build this dApp was used:

1. [Aurora network (Testnet)](https://aurora.dev/) - an Ethereum Virtual Machine (EVM) built on the NEAR Protocol Blockchain. 
2. [Livepeer](https://livepeer.org/) - decentralized video streaming network
3. [Video.js](https://www.npmjs.com/package/video.js) - web video player that support HLS (HTTP Live Streaming)
4. [Hardhat](https://hardhat.org/)
5. [Infura IPFS](https://infura.io/product/ipfs)
6. HTML / CSS / JS


### DApp Screens:

<img src="demo-img/demo1.png">
<img src="demo-img/demo1.png">
