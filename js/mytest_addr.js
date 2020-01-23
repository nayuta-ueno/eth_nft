//exports.CONTRACT_ADDR = '0x90FE9567266FDfF1C2BEcacd50323BbAa9F53453';

//const PROVIDER_HTTP = 'http://10.0.1.80:8545';
const PROVIDER_WS = 'ws://127.0.0.1:9545';
var Web3 = require('web3');
var web3;

// HTTTPはdeprecated
// https://web3js.readthedocs.io/en/v1.2.0/web3.html#providers
//
// exports.getWeb3Legacy = function() {
//     web3 = new Web3();
//     var ver = web3.version.split('.');
//     if ((ver[0] < 1) || (ver[1] < 0)) {
//         console.error("ERROR: need web3.version(" + web3.version + ") < 1.0");
//         process.exit(1);
//     }
//     web3.setProvider(new web3.providers.HttpProvider(PROVIDER_HTTP));
//     return web3;
// }

exports.getWeb3 = function() {
    web3 = new Web3();
    var ver = web3.version.split('.');
    if ((ver[0] < 1) || (ver[1] < 0)) {
        console.error("ERROR: need web3.version(" + web3.version + ") < 1.0");
        process.exit(1);
    }
    web3.setProvider(new web3.providers.WebsocketProvider(PROVIDER_WS));
    return web3;
}

exports.getContract = function() {
    const fs = require('fs');
    const DEPLOYED = JSON.parse(fs.readFileSync('../build/contracts/TestNFT.json', 'utf8'))
    const ABI = DEPLOYED['abi'];
    const CONTRACT_ADDR = DEPLOYED['networks']['5777']['address'];
    return new web3.eth.Contract(ABI, CONTRACT_ADDR);
}
