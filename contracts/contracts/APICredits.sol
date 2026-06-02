// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts@5.0.2/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";

interface ICommunityNFT {
    function consecutiveMintDays(address user) external view returns (uint256);
}

contract APICredits is ERC20, Ownable {
    uint256 public constant INITIAL_REWARD = 100 * 10**18;
    uint256 public constant DAILY_REWARD = 50 * 10**18;
    uint256 public constant WEEKLY_BONUS = 1000 * 10**18;

    ICommunityNFT public nftContract;

    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public consecutiveDays;

    constructor() ERC20("API Credits", "APIC") Ownable(msg.sender) {}

    function setNFTContract(address _nftContract) external onlyOwner {
        nftContract = ICommunityNFT(_nftContract);
    }

    function claim() external {
        uint256 reward = 0;

        // First time interaction
        if (lastClaimTime[msg.sender] == 0) {
            reward = INITIAL_REWARD;
            consecutiveDays[msg.sender] = 1;
        } else {
            // Must wait 24 hours
            require(block.timestamp >= lastClaimTime[msg.sender] + 1 days, "Wait 24 hours between claims");
            
            // Maintain or break streak
            if (block.timestamp <= lastClaimTime[msg.sender] + 2 days) {
                consecutiveDays[msg.sender] += 1;
            } else {
                consecutiveDays[msg.sender] = 1;
            }
            reward = DAILY_REWARD;
        }

        lastClaimTime[msg.sender] = block.timestamp;

        // Check for 7-day streak bonus across both contracts
        if (consecutiveDays[msg.sender] > 0 && consecutiveDays[msg.sender] % 7 == 0) {
            if (address(nftContract) != address(0)) {
                if (nftContract.consecutiveMintDays(msg.sender) >= 7) {
                    reward += WEEKLY_BONUS;
                }
            }
        }

        _mint(msg.sender, reward);
    }
}
