var mytest = require('./mytest_addr.js');
var web3 = mytest.getWeb3();

// contractに送金
async function async_func() {
    //show bytecode
    // var bc = await web3.eth.getCode(mytest.CONTRACT_ADDR);
    // console.log("bytecode=%o", bc);
    // return;

    var inst;
    var accounts = await web3.eth.getAccounts();
    var owner = accounts[0];
    var newOwner = accounts[1];
    var tokenId = new web3.utils.BN('1');

    console.log("owner=" + owner);
    console.log("newOwner=" + newOwner);
    console.log("tokenID=" + tokenId);
    console.log("token owner=%o", await mytest.getContract().methods.ownerOf(tokenId).call());

    console.log("\n==== owner ====");
    web3.eth.defaultAccount = owner;
    inst = mytest.getContract().methods;
    console.log("isLocked=" + await inst.isLocked(tokenId).call());
    console.log("getMinimumTimeout()=" + await inst.getMinimumTimeout(tokenId).call());
    try {
        var res = await inst.getLockParameter(tokenId).call();
        console.log("lockParameter=%o", res);
    } catch (err) {
        console.log("err=" + err);
    }

    console.log("\n==== newOwner ====");
    web3.eth.defaultAccount = newOwner;
    inst = mytest.getContract().methods;
    console.log("isLocked=" + await inst.isLocked(tokenId).call());
    console.log("getMinimumTimeout()=" + await inst.getMinimumTimeout(tokenId).call());
    try {
        var res = await inst.getLockParameter(tokenId).call();
        console.log("lockParameter=%o", res);
    } catch (err) {
        console.log("err=" + err);
    }

    //await new Promise(r => setTimeout(r, 1000));
    process.exit(0);
}
async_func();
