# TestNFT

## settings

```bash
node install web3 @openzeppelin/contracts
truffle develop
> migrate
```

## run

```bash
cd js

# tokenを追加
# 初回は'1'で、jsファイル内では全部'1'前提にしている
node ./1_addtoken.js

# ownerやlock状態を見る(newOwnerだけlock条件が見える)
node check.js

# lock
node ./2_lock.js

# transfer
node ./3_transfer.js
```
