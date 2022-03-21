// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OnlineEventsPass is ERC721URIStorage, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string NftPassUri;
    uint256 public maxSupply = 10000;

    constructor(string memory _name, string memory _symbol, string memory _initNftPassUri) ERC721(_name, _symbol) {
        setNftPassUri(_initNftPassUri);
    }

    function mintNFT() public returns (uint256){
        require(balanceOf(msg.sender) == 0, "You already have a NFT Pass");
        require(_tokenIds.current() + 1 <= maxSupply, "All NFTs was minted");
        uint256 newItemId = _tokenIds.current() + 1;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, NftPassUri);
        _tokenIds.increment();
        return newItemId;
    }

    function setNftPassUri(string memory _newNftPassUri) public onlyOwner {
        NftPassUri = _newNftPassUri;
    }

    function getNftPassUri() public view returns (string memory){
        return NftPassUri;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token" );
        return getNftPassUri();
    }

}