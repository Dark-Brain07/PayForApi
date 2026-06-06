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

    function registerApi(string memory endpointId) external {
        require(apiEndpoints[endpointId].creator == address(0), "Endpoint already registered");
        apiEndpoints[endpointId] = ApiEndpoint({
            creator: msg.sender,
            isActive: true,
            totalRevenue: 0
        });
        emit ApiRegistered(endpointId, msg.sender);
    }

    function payForApi(string memory endpointId, address tokenAddress, uint256 amount) external {
        ApiEndpoint storage api = apiEndpoints[endpointId];
        require(api.isActive, "API not active");
        
        uint256 platformShare = (amount * platformFeePercentage) / 100;
        uint256 creatorShare = amount - platformShare;

        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, platformWallet, platformShare), "Platform fee transfer failed");
        require(token.transferFrom(msg.sender, api.creator, creatorShare), "Creator payment transfer failed");

        api.totalRevenue += creatorShare;
        emit PaymentProcessed(endpointId, amount, creatorShare, platformShare);
    }
}
