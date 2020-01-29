const mytest = require('./mytest_addr.js');
var web3 = mytest.getWeb3();

// contractに送金
async function async_func() {
    var inst = mytest.getContract().methods;

    var owner = TOKEN_OWNER.TOKEN_OWNER;
    var newOwner = TOKEN_OWNER.TOKEN_NEWOWNER;
    console.log("owner=" + owner);
    console.log("newOwner=" + newOwner);

    var tokenId = new web3.utils.BN('1');
    try {
        var res = await inst.approve(newOwner, tokenId).send({from: owner});
        console.log("approve= %o", res);
    } catch (err) {
        console.log("err(approve)= " + err);
    }
    try {
        var res = await inst.setApprovalForAll(newOwner, true).send({from: owner});
        console.log("setApprovalForAll= %o", res);
    } catch (err) {
        console.log("err(setApprovalForAll)= " + err);
    }
    try {
        var res = await inst.transferFrom(owner, newOwner, tokenId).send({from: owner});
        console.log("transferFrom= %o", res);
    } catch (err) {
        console.log("err(transferFrom)= " + err);
    }
    try {
        var res = await inst.transferFrom(owner, newOwner, tokenId).send({from: owner});
        console.log("safeTransferFrom4= %o", res);
    } catch (err) {
        console.log("err(safeTransferFrom4)= " + err);
    }
    try {
        var res = await inst.transferFrom(owner, newOwner, tokenId).send({from: owner});
        console.log("safeTransferFrom3= %o", res);
    } catch (err) {
        console.log("err(safeTransferFrom3)= " + err);
    }

    process.exit(0);
}
async_func();
