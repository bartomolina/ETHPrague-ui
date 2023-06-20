// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.9.1/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.1/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.9.1/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@4.9.1/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.9.1/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.1/utils/Counters.sol";
import "@openzeppelin/contracts@4.9.1/utils/Base64.sol";

contract Mosaic is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(address => string) private secrets;

    constructor() ERC721("Mosaic", "MSC") {}

    function safeMint(address to, string memory uri) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function formatJSON(string calldata profileId) public pure returns (string memory) {
        string memory baseURL = "data:application/json;base64,";
        string memory json = string(abi.encodePacked('{"name": "', profileId, '"}'));
        string memory jsonBase64Encoded = Base64.encode(bytes(json));
        return string(abi.encodePacked(baseURL, jsonBase64Encoded));
    }

    function setSecret(address linkedAddress, string calldata secret) public {
        // TODO: verify msg.sender owns the linkedAddress
        secrets[linkedAddress] = secret;
    }

    function joinOrganization(address linkedAddress, string calldata profileId, string calldata secret) public {
        // require(keccak256(abi.encodePacked((secret))) == keccak256(abi.encodePacked((secrets[linkedAddress]))));
        string memory uri = formatJSON(profileId);
        safeMint(linkedAddress, uri);
    }
}
