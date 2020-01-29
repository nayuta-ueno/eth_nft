var mytest = require('./mytest_addr.js');
const TOKEN_OWNER = require('./token_owner.js');
var web3 = mytest.getWeb3();


async function async_func() {
    var inst = mytest.getContract();

    inst.events.Transfered({}, function(err, msg) {
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

    var owner = TOKEN_OWNER.TOKEN_OWNER;
    var newOwner = TOKEN_OWNER.TOKEN_NEWOWNER;
    var tokenId = new web3.utils.BN(TOKEN_OWNER.TOKEN_ID);
    console.log("owner=" + owner);
    console.log("newOwner=" + newOwner);
    console.log("tokenID=" + tokenId);
    console.log("token owner=%o", await inst.ownerOf(tokenId).call());

    //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
    //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
    var preimage = "0x001122334455667788990011223344556677889900112233445566778899aabb";
    try {
        mytest.setWallet();
        esGas = await inst.transferToken(
                tokenId,
                preimage,
                newOwner)
            .estimateGas({from: owner});
        console.log("esGas=" + esGas);
        tx = await inst.transferToken(
                tokenId,
                preimage,
                newOwner)
            .send({from: owner, gas: esGas});
        console.log("transferToken= %o", tx);
        mytest.setWebsocket();
    } catch (err) {
        console.log("err=" + err);
    }
    console.log("token owner=%o", await inst.ownerOf(tokenId).call());

    process.exit(0);
}
async_func();
