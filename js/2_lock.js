const mytest = require('./mytest_addr.js');
var web3 = mytest.getWeb3();

// contractに送金
async function async_func() {
    var inst = mytest.getContract();
    inst.events.Locked({
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
    var owner = accounts[0];
    var newOwner = accounts[1];
    var tokenId = new web3.utils.BN('1');
    console.log("owner=" + owner);
    console.log("newOwner=" + newOwner);
    console.log("tokenID=" + tokenId);
    console.log("token owner=%o", await inst.ownerOf(tokenId).call());

    //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
    //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
    try {
        paymentHash = "0x0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8";
        var esGas = await inst.lockToken(
                    tokenId,
                    paymentHash,
                    newOwner, 10000, 200)
                .estimateGas();
        console.log("esGas=" + esGas);
        var res = await inst.lockToken(
                    tokenId,
                    paymentHash,
                    newOwner, 10000, 200)
                .send({from: owner, gas: esGas});
        console.log("lockToken= %o", res);
    } catch (err) {
        console.log("err= " + err);
    }
    console.log("token owner=%o", await inst.ownerOf(tokenId).call());

    process.exit(0);
}
async_func();
