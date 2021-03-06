const mytest = require('./mytest_addr.js');
var web3 = mytest.getWeb3();


async function async_func() {
    //console.log('Protocol Version: ' + await web3.eth.getProtocolVersion());
    console.log('gas Price: ' + await web3.eth.getGasPrice());

    var inst = mytest.getContract().methods;
    const TOKEN_OWNER = require('./token_owner.js');
    var owner = TOKEN_OWNER.TOKEN_OWNER;
    web3.eth.defaultAccount = owner;
    console.log("owner=" + owner);
    console.log("owner balance=" + await web3.eth.getBalance(owner));

    try {
        var esGas = await inst.newToken(owner, "https://localhost/1").estimateGas();
        console.log("estimateGas=" + esGas);
        mytest.setWallet();
        var res = await inst.newToken(owner, "https://localhost/1")
                            .send({from: owner, gas: esGas});
        console.log("newToken= %o", res);
        mytest.setWebsocket();
        var tokenId = res['events']['Transfer']['returnValues']['tokenId'];
        console.log("tokenId=" + tokenId);
    } catch (err) {
        console.log("err=" + err);
    }

    process.exit(0);
}
async_func();
