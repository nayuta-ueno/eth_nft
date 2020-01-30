var mytest = require('./mytest_addr.js');
var web3 = mytest.getWeb3();

// contractに送金
async function async_func() {
    //show bytecode
    // var bc = await web3.eth.getCode(mytest.CONTRACT_ADDR);
    // console.log("bytecode=%o", bc);
    // return;

    const TOKEN_OWNER = require('./token_owner.js');
    var owner = TOKEN_OWNER.TOKEN_OWNER;
    var newOwner = TOKEN_OWNER.TOKEN_NEWOWNER;
    var tokenId = new web3.utils.BN(TOKEN_OWNER.TOKEN_ID);

    console.log("owner=" + owner);
    console.log("newOwner=" + newOwner);
    console.log("tokenID=" + tokenId);
    try {
        console.log("token owner=%o", await mytest.getContract().methods.ownerOf(tokenId).call());
    } catch (err) {
        console.log("token id not exist");
        process.exit(1);
    }

    if ((typeof owner === 'undefined') || (typeof newOwner === 'undefined')) {
        console.log('undefined !!!');
        process.exit(1);
    }
    
    console.log("\n==== owner ====");
    web3.eth.defaultAccount = owner;
    var inst = mytest.getContract().methods;
    console.log("isLocked=" + await inst.isLocked(tokenId).call());
    try {
        console.log("getMinimumTimeout()=" + await inst.getMinimumTimeout(tokenId).call());
        var res = await inst.getLockParameter(tokenId).call();
        console.log("lockParameter=%o", res);
    } catch (err) {
        console.log("err=" + err);
    }

    console.log("\n==== newOwner ====");
    web3.eth.defaultAccount = newOwner;
    inst = mytest.getContract().methods;
    console.log("isLocked=" + await inst.isLocked(tokenId).call());
    try {
        console.log("getMinimumTimeout()=" + await inst.getMinimumTimeout(tokenId).call());
        var res = await inst.getLockParameter(tokenId).call();
        console.log("lockParameter=%o", res);
    } catch (err) {
        console.log("err=" + err);
    }

    //await new Promise(r => setTimeout(r, 1000));
    process.exit(0);
}
async_func();
