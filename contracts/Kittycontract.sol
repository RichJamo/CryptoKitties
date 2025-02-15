pragma solidity ^0.8.4;

import "./IERC721.sol";
import "./Ownable.sol";
import "./IERC721Receiver.sol";

contract Kittycontract  is  IERC721, Ownable  {
    uint256 public constant CREATION_LIMIT_GEN0 = 10;
    string public constant tokenName = "RichKitties";
    string public constant tokenSymbol= "RK";
    bytes4 internal constant MAGIC_ERC721_RECEIVED = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint64 mumId;
        uint32 dadId;
        uint16 generation;
    }

    Kitty[] kitties;

    mapping (address => uint256) ownershipTokenCount; //maps from owner's address to how many tokens they own
    mapping (uint256 => address) public kittyIndexToOwner; //maps from kitties array index (tokenId?) to address of kitty owner
    mapping (address => uint256[]) public ownerToKitties; //maps from an owner to an array of kitty id's
    mapping (uint256 => uint256) public KittyIDtoOwnerIndex;

    mapping (uint256 => address) public kittyIndexToApproved;
    mapping (address => mapping(address => bool)) private _operatorApprovals; //msg.sender=>operator=>true/false?
    
    uint256 public gen0Counter;

    function breed(uint256 _dadId, uint256 _mumId) public returns (uint256) {
        //check ownership
        require (_owns(msg.sender, _dadId) && _owns(msg.sender, _mumId), "The user doesn't own the tokens required");
        //what is the generation of the new cat? mom and dad could be different
        //(uint256 dadDna,,,,uint256 DadGeneration) = getKitty(_dadId);
        //(uint256 mumDna,,,,uint256 MumGeneration) = getKitty(_mumId);
        //create new cat ith the new properties, give it to msg.sender
        uint256 dadDna = getKitty(_dadId).genes;
        uint256 mumDna = getKitty(_mumId).genes;
        uint256 newDna = _mixDna(dadDna, mumDna);
        uint256 _generation;
        
        if (getKitty(_dadId).generation > getKitty(_mumId).generation) {
            _generation = getKitty(_dadId).generation +1;
        }
            else _generation = getKitty(_mumId).generation +1;

        return _createKitty(_mumId, _dadId, _generation, newDna, msg.sender); //returns new Kitten ID
    }

    function supportsInterface(bytes4 _interfaceId) external pure returns (bool){
        return ( _interfaceId == _INTERFACE_ID_ERC721 || _interfaceId == _INTERFACE_ID_ERC165);
    }

    function _safeTransfer (address _from, address _to, uint256 _tokenId, bytes memory data) internal {
        _transfer(_from, _to, _tokenId);
        require(_checkERC721Support(_from, _to, _tokenId, data));
    }

    function createKittyGen0(uint256 _genes) public onlyOwner returns (uint256) {
        require (gen0Counter < CREATION_LIMIT_GEN0, "Creation limit for Kitties reached");
        
        gen0Counter++;

        return _createKitty(0, 0, 0, _genes, msg.sender);
    }

    function _createKitty(
        uint256 _mumId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) private returns (uint256) {
        Kitty memory _kitty = Kitty({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });
    
        kitties.push(_kitty);
        uint256 newKittenId = kitties.length-1;

        emit Birth(_owner, newKittenId, _mumId, _dadId, _genes);

        _transfer(address(0), _owner, newKittenId);

        return newKittenId;
    }

    function getKitty(uint256 _tokenId) public view returns (Kitty memory) {
        return kitties[_tokenId];
    }

    function getKittyGenes(uint256 _tokenId) public view returns (uint256 genes) {
        return kitties[_tokenId].genes;
    }
    
    function getKittyGenesv2(uint256[] _tokenId) public view returns (uint256[] genes) {
        return kitties[_tokenId].genes;
    }
    
    function getKittiesByOwner(address _owner) public view returns (uint256[] memory) {
        return ownerToKitties[_owner];
    }

    event Birth(address owner, uint256 kittenId, uint256 mumId, uint256 dadId, uint256 genes);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address _owner) public view override returns (uint256 balance) { //external means you can't call it from within the contract
        return ownershipTokenCount[_owner];
    }
    /*
     * @dev Returns the total number of tokens in circulation.
     */
    function totalSupply() public view override returns (uint256) {
        return kitties.length;
    }

    /*
     * @dev Returns the name of the token.
     */
    function name() external pure override returns (string memory) {
        return tokenName;
    }

    /*
     * @dev Returns the symbol of the token.
     */
    function symbol() external pure override returns (string memory) {
        return tokenSymbol;
    }

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 _tokenId) external view override returns (address owner) {
        return kittyIndexToOwner[_tokenId]; //what does this mean? Is there just one tokenId? Or multiple?
    }


     /* @dev Transfers `tokenId` token from `msg.sender` to `to`.
     *
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `to` can not be the contract address.
     * - `tokenId` token must be owned by `msg.sender`.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address _to, uint256 _tokenId) external override {
        require (_to != address(0), "Cannot transfer tokenId to zero address");
        require (_to != address(this), "Cannot transfer tokenId to contract address");
        require (_owns(msg.sender,_tokenId), "Cannot transfer tokenId if you don't own it");

        _transfer(msg.sender, _to, _tokenId);
        }

    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        if (_from != address(0)){
            uint256 lastTokenIndex = balanceOf(_from) - 1;
            uint256 tokenIndex = KittyIDtoOwnerIndex[_tokenId];
            if(tokenIndex != lastTokenIndex){
                uint256 lastTokenId = ownerToKitties[_from][lastTokenIndex];
                ownerToKitties[_from][tokenIndex] = lastTokenId;
                KittyIDtoOwnerIndex[lastTokenId] = tokenIndex;
                }
            ownerToKitties[_from].pop();
            delete kittyIndexToApproved[_tokenId];
            }
        ownerToKitties[_to].push(_tokenId);
        KittyIDtoOwnerIndex[_tokenId] = ownerToKitties[_to].length - 1;
        kittyIndexToOwner[_tokenId] = _to;
        //emit the transfer event
        emit Transfer(msg.sender, _to, _tokenId);
    }
    

    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return kittyIndexToOwner[_tokenId] == _claimant;
    }

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    
    function approve(address _approved, uint256 _tokenId) external override {
        require (_owns(msg.sender,_tokenId)|| _operatorApprovals[msg.sender][_approved]==true, "Cannot set approval for this tokenId if you don't own it or are approved for it");

        _approve(_approved, _tokenId);

        emit Approval(msg.sender, _approved, _tokenId);
    }

    function _approve(address _approved, uint256 _tokenId) private {
        kittyIndexToApproved[_tokenId] = _approved;
    }

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    
    function setApprovalForAll(address _operator, bool _approved) external override {
        require(_operator != msg.sender, "Cannot set asset owner as operator");

        _operatorApprovals[msg.sender][_operator]=_approved;
        //do I have to loop through all of this msg.sender's tokens and approve for each of them?
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT.
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external override view returns (address) {
        require(kittyIndexToOwner[_tokenId] != address(0) ); //check if it's a valid NFT, i.e. if it has an owner
            
        return kittyIndexToApproved[_tokenId]; //will this return the zero address if there is none?
    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    
    function isApprovedForAll(address _owner, address _operator) public override view returns (bool) {
        
        return _operatorApprovals[_owner][_operator];
    }

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    
    function transferFrom(address _from, address _to, uint256 _tokenId) external override {
        require ( _isApprovedOwner(msg.sender, _from, _to, _tokenId) );

        _transfer(_from, _to, _tokenId);
    }

        /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata data) override external {
        require( _isApprovedOwner(msg.sender, _from, _to, _tokenId) );
        
        _safeTransfer(_from, _to, _tokenId, data);
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to "".
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) override external {
        require( _isApprovedOwner(msg.sender, _from, _to, _tokenId) );
        
        _safeTransfer(_from, _to, _tokenId, "");
    }

    function approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return kittyIndexToApproved[_tokenId] == _claimant;
    }

    function _checkERC721Support(address _from, address _to, uint256 _tokenId, bytes memory _data) internal returns (bool) {
        if( !_isContract(_to) ){ //if it isn't a contract, we're sending to a wallet, and no further checks required
            return true;
        }
        
        //have to call the _to contract, call onERC721Received
        bytes4 returnData = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);

        //check return value is equal to bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))
        return returnData == MAGIC_ERC721_RECEIVED;
    }

    function _isContract(address _to) view internal returns (bool) {
        uint32 size;
        assembly{
            size := extcodesize(_to)
        }
        return size > 0; //if code size > 0, then it is a contract (as opposed to a wallet)
    }

    function _isApprovedOwner(address _spender, address _from, address _to, uint256 _tokenId) internal view returns (bool) {
        require(_tokenId < kitties.length); //token must exist
        require(_to != address(0)); //TO address is not zero address
        require(_owns(_from, _tokenId)); //FROM owns the token
        
        //spender is from OR spender is approved OR spender is operator for from
        return (_spender ==_from|| approvedFor(_spender,_tokenId)|| isApprovedForAll(_from, _spender));

    }

    function _mixDna (uint256 _dadDna, uint256 _mumDna) internal pure returns (uint256) {
        uint256 firstHalf= _dadDna / 100000000; //get first half of Dad's Dna
        uint256 secondHalf = _mumDna % 100000000; //get second half of Mum's Dna
        
        return firstHalf*100000000 + secondHalf; //combines the two Dna strings
    }
}