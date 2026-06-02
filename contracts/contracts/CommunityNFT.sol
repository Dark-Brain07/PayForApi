// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts@5.0.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";

contract CommunityNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 100000;
    uint256 public totalSupply;

    mapping(address => uint256) public lastMintTime;
    mapping(address => uint256) public consecutiveMintDays;

    constructor() ERC721("PayForAPI Community", "PFAC") Ownable(msg.sender) {}

    function mint(uint256 amount) external {
        require(totalSupply + amount <= MAX_SUPPLY, "Max supply reached");
        
        // Update daily mint streak
        if (lastMintTime[msg.sender] == 0) {
            consecutiveMintDays[msg.sender] = 1;
        } else if (block.timestamp >= lastMintTime[msg.sender] + 1 days) {
            if (block.timestamp <= lastMintTime[msg.sender] + 2 days) {
                consecutiveMintDays[msg.sender] += 1;
            } else {
                consecutiveMintDays[msg.sender] = 1; // Reset streak
            }
        }
        
        // Update the timestamp if they haven't minted today yet
        if (block.timestamp >= lastMintTime[msg.sender] + 1 days || lastMintTime[msg.sender] == 0) {
             lastMintTime[msg.sender] = block.timestamp;
        }

        // Mint unlimited amount (up to max supply)
        for (uint256 i = 0; i < amount; i++) {
            totalSupply++;
            _safeMint(msg.sender, totalSupply);
        }
    }
}
