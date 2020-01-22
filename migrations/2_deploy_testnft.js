const testNFT = artifacts.require("TestNFT");

module.exports = function(deployer) {
  deployer.deploy(testNFT);
};
