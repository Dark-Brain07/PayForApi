// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract APIRevenueSplitter is Ownable {
    uint256 public platformFeePercentage = 10; // 10%
    address public platformWallet;

    struct ApiEndpoint {
        address creator;
        bool isActive;
        uint256 totalRevenue;
    }

    mapping(string => ApiEndpoint) public apiEndpoints;

    event ApiRegistered(string endpointId, address creator);
    event PaymentProcessed(string endpointId, uint256 amount, uint256 creatorShare, uint256 platformShare);

    constructor(address _platformWallet) Ownable(msg.sender) {
        platformWallet = _platformWallet;
    }

