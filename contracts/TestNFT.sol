pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";


/**
  * @title TestNFT NFTのテスト
  * @notice EtherでNFTの割当を変更できる
  */
contract TestNFT is ERC721Full {

  using Counters for Counters.Counter;

  enum LockStat_t { Undef, Unlock, Lock }

  /////////////////////////////////////////////////////////////////////////
  // events
  /////////////////////////////////////////////////////////////////////////

  /**
   * @notice HTLCができた
   */
  event Locked(address indexed newOwner, bytes32 paymentHash);

  /**
   * @notice HTLCから支払われた
   */
  event Transfered(address indexed from, address indexed to, uint256 tokenId, bytes32 preimage);

  /**
   * @notice HTLCがとりやめられた
   */
  event Withdrawn(address indexed newOwner);


  /////////////////////////////////////////////////////////////////////////
  // structs
  /////////////////////////////////////////////////////////////////////////

  /**
   * @notice HTLC
   */
  struct HtlcData {
    bytes32 paymentHash;        ///< paymentHash
    address newOwner;           ///< 移譲先
    uint256 amount;             ///< 要求額
    uint256 height;             ///< lockしたときのblockNumber
    uint256 delay;              ///< タイムアウトするblock
    LockStat_t locked;
  }


  /////////////////////////////////////////////////////////////////////////
  // variables
  /////////////////////////////////////////////////////////////////////////

  /**
   * @dev key:tokenID
   */
  mapping(uint256 => HtlcData) _htlcData;

  /** @dev tokenID counter */
  Counters.Counter private _tokenIds;


  /////////////////////////////////////////////////////////////////////////
  // public functions
  /////////////////////////////////////////////////////////////////////////

  constructor() ERC721Full("TestNFT", "TNFT") public {
  }


  function approve(address, uint256) public {
    revert("not supported");
  }

  function setApprovalForAll(address, bool) public {
    revert("not supported");
  }

  function transferFrom(address, address, uint256) public {
    revert("not supported");
  }

  function safeTransferFrom(address, address, uint256, bytes memory) public {
    revert("not supported");
  }

  // function ownerOf(uint256 tokenId) public view returns (address) {
  //   address owner = super.ownerOf(tokenId);
  //   require(!_htlcData[tokenId].locked, "locked");

  //   return owner;
  // }

  /**
   * @notice add new NFT
   * @param owner 所有者アドレス
   * @param tokenURI 付加情報URI
   * @return tokenID
   * @dev tokenIDをインクリメントして割り当てる
   */
  function newToken(address owner, string memory tokenURI) public returns (uint256) {
    _tokenIds.increment();

    uint256 newTokenId = _tokenIds.current();
    _mint(owner, newTokenId);
    _setTokenURI(newTokenId, tokenURI);

    return newTokenId;
  }


  /**
   * @notice lock NFT with HTLC
   * @param tokenId lockするNFTのtoken ID
   * @param paymentHash payment hash
   * @param newOwner 移譲予定アドレス
   * @param amount 移譲額
   * @param delay タイムアウトブロック数
   * @dev 指定されたtoken IDをlockして、sell()するかunlockPayment()するまで使用不可にする。
   */
  function lockToken(uint256 tokenId, bytes32 paymentHash, address newOwner, uint256 amount, uint256 delay) public {
    require(ownerOf(tokenId) == msg.sender, "not token owner");
    require(_htlcData[tokenId].locked != LockStat_t.Lock, "already locked");
    require(msg.sender.balance > amount, "need more balance");

    _htlcData[tokenId].paymentHash = paymentHash;
    _htlcData[tokenId].newOwner = newOwner;
    _htlcData[tokenId].amount = amount;
    _htlcData[tokenId].height = block.number; //miningされたときのblockNumberになるようだ
    _htlcData[tokenId].delay = delay;
    _htlcData[tokenId].locked = LockStat_t.Lock;

    emit Locked(newOwner, paymentHash);
  }


  /**
   * @notice lockされたNFTの所有者を変更する
   * @param tokenId lockするNFTのtoken ID
   * @param preImage payment hash == sha256(preImage)
   * @param newOwner 移譲先アドレス
   * @dev tokenの所有者をnewOwnerに変更し、lockを解除する
   */
  function transferToken(uint256 tokenId, bytes32 preImage, address newOwner) public {
    require(_htlcData[tokenId].locked == LockStat_t.Lock, "not locked");
    require(_htlcData[tokenId].newOwner == newOwner, "unknown address");
    //require(msg.sender.balance > _htlcData[tokenId].amount, "bad balance.");
    bytes32 hash = sha256(abi.encodePacked(preImage));
    require(hash == _htlcData[tokenId].paymentHash, "invalid preimage");

    address owner = ownerOf(tokenId);
    super._transferFrom(ownerOf(tokenId), newOwner, tokenId);
    _htlcData[tokenId].locked = LockStat_t.Unlock;

    emit Transfered(owner, newOwner, tokenId, preImage);
  }


  /**
   * @notice lockされたNFTを解除する
   * @param tokenId unlockするNFTのtoken ID
   */
  function unlockToken(uint256 tokenId) public {
    require(_htlcData[tokenId].locked == LockStat_t.Lock, "not locked");
    require(block.number - _htlcData[tokenId].height > _htlcData[tokenId].delay, "-68");

    _htlcData[tokenId].locked = LockStat_t.Unlock;

    emit Withdrawn(_htlcData[tokenId].newOwner);
  }


  /**
   * @notice lock状態の取得
   * @param tokenId token ID
   * @return true:lock済み
   * @dev lock済みなのにgetLockParameter()で失敗したら、他の人がnewOwnerになっているということ。
   */
  function isLocked(uint256 tokenId) public view returns(LockStat_t) {
    require(false, "NG");
    return _htlcData[tokenId].locked;
  }


  /**
   * @notice lockパラメータ状態の取得
   * @param tokenId token ID
   * @return paymentHash, lockHeight, delay
   */
  function getLockParameter(uint256 tokenId) public view returns(bytes32, uint256, uint256) {
    require(_htlcData[tokenId].locked == LockStat_t.Lock, "not locked");
    require(_htlcData[tokenId].newOwner == _msgSender(), "not newOwner");
    return (_htlcData[tokenId].paymentHash, _htlcData[tokenId].height, _htlcData[tokenId].delay);
  }


  /**
   * @notice timeoutブロックの取得
   * @param tokenId token ID
   * @return unlockPayment()できる最小のブロック番号
   */
  function getMinimumTimeout(uint256 tokenId) public view returns(uint256) {
    require(_htlcData[tokenId].locked == LockStat_t.Lock, "not locked");
    return _htlcData[tokenId].height + _htlcData[tokenId].delay + 1;
  }


  /////////////////////////////////////////////////////////////////////////
  // private functions
  /////////////////////////////////////////////////////////////////////////

}