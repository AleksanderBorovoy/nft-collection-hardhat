// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./NFTCollection.sol";

contract Factory {
    address[] public collections;
    uint256 public collectionsCount;
    event CollectionCreated(address indexed _contractAddress, string _name, string _symbol);

    function deployCollection(string memory _name, string memory _symbol) external {
        NFTCollection nftCollection = new NFTCollection(_name, _symbol);
        nftCollection.transferOwnership(msg.sender);
        collections.push(address(nftCollection));
        collectionsCount += 1;
        emit CollectionCreated(address(nftCollection), _name, _symbol);
    }
}
