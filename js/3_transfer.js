var mytest = require('./mytest_addr.js');
const TOKEN_OWNER = require('./token_owner.js');
var web3 = mytest.getWeb3();

// contractに送金
async function async_func() {
    var inst = mytest.getContract();
    inst.events.Transfered({
        fromBlock: 0
    }, function(err, msg) {
        if (err) {
            console.error("fail get event")
            process.exit(1);
        }
    }).on('data', (data) => {
        console.log("[EV]data= %o", data);
    }).on('changed', (data) => {
        console.log("[EV]changed= %o", data);
    }).on('error', (data) => {
        console.log("[EV]error= %o", data);
    });

    inst = inst.methods;

    const accounts = await web3.eth.getAccounts();
    var owner = accounts[TOKEN_OWNER.TOKEN_OWNER];
    var newOwner = accounts[TOKEN_OWNER.TOKEN_NEWOWNER];
    var tokenId = new web3.utils.BN(TOKEN_OWNER.TOKEN_ID);
    console.log("owner=" + owner);
    console.log("newOwner=" + newOwner);
    console.log("tokenID=" + tokenId);
    console.log("token owner=%o", await inst.ownerOf(tokenId).call());

    //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
    //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
    var preimage = "0x001122334455667788990011223344556677889900112233445566778899aabb";
    try {
        esGas = await inst.transferToken(
                tokenId,
                preimage,
                newOwner)
            .estimateGas();
        tx = await inst.transferToken(
                tokenId,
                preimage,
                newOwner)
            .send({from: owner, gas: esGas});
        console.log("transferToken= %o", tx);
    } catch (err) {
        console.log("err=" + err);
        assert.isTrue(false);
    }
    console.log("token owner=%o", await inst.ownerOf(tokenId).call());

    process.exit(0);
}
async_func();
