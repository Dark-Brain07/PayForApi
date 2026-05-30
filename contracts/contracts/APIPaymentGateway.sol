// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract APIPaymentGateway is Ownable, ReentrancyGuard {
    
    struct APIProduct {
        string name;
        string description;
        uint256 priceUSD;      // price in 18 decimal cUSD equivalent
        bool active;
        uint256 totalCalls;
        uint256 totalRevenue;
    }

    struct Payment {
        address user;
        address token;
        uint256 amount;
        string apiProduct;
        uint256 timestamp;
        bytes32 requestId;
    }

    mapping(uint256 => APIProduct) public apiProducts;
    mapping(address => bool) public supportedTokens;
    mapping(address => string) public tokenSymbols;
    mapping(bytes32 => bool) public processedRequests;
    mapping(address => uint256) public userCallCount;
    mapping(address => uint256) public userTotalSpent;
    
    Payment[] public payments;
    uint256 public productCount;
    uint256 public totalRevenue;
    uint256 public totalCalls;
    address public treasury;
    uint256 public platformFee; // basis points (500 = 5%)

    event PaymentProcessed(
        address indexed user,
        address indexed token,
        uint256 amount,
        string apiProduct,
        bytes32 requestId,
        uint256 timestamp
    );
    
    event ProductAdded(uint256 indexed productId, string name, uint256 price);
    event TokenAdded(address indexed token, string symbol);

    constructor(address _treasury) Ownable(msg.sender) {
        treasury = _treasury;
        platformFee = 500; // 5%
        
        // Initialize API products
        _addProduct("AI Chat", "GPT-4 powered chat completion", 1e15); // 0.001 cUSD
        _addProduct("Image Analysis", "Vision AI image understanding", 3e15); // 0.003 cUSD
        _addProduct("Web Search", "Real-time web search results", 2e15); // 0.002 cUSD
        _addProduct("Data Analysis", "Advanced data processing", 5e15); // 0.005 cUSD
        _addProduct("Translation", "Multi-language translation", 1e15); // 0.001 cUSD
        _addProduct("Summarization", "Document summarization", 2e15); // 0.002 cUSD
    }

    function _addProduct(string memory name, string memory desc, uint256 price) internal {
        apiProducts[productCount] = APIProduct(name, desc, price, true, 0, 0);
        emit ProductAdded(productCount, name, price);
        productCount++;
    }

    function addSupportedToken(address token, string memory symbol) external onlyOwner {
        supportedTokens[token] = true;
        tokenSymbols[token] = symbol;
        emit TokenAdded(token, symbol);
    }

    function payForAPI(
        address token,
        uint256 amount,
        uint256 productId,
        bytes32 requestId
    ) external nonReentrant {
        require(supportedTokens[token], "Token not supported");
        require(!processedRequests[requestId], "Request already processed");
        require(productId < productCount, "Invalid product");
        require(apiProducts[productId].active, "Product not active");

        processedRequests[requestId] = true;
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        uint256 fee = (amount * platformFee) / 10000;
        uint256 netAmount = amount - fee;
        
        IERC20(token).transfer(treasury, netAmount);
        
        apiProducts[productId].totalCalls++;
        apiProducts[productId].totalRevenue += amount;
        userCallCount[msg.sender]++;
        userTotalSpent[msg.sender] += amount;
        totalCalls++;
        totalRevenue += amount;

        payments.push(Payment({
            user: msg.sender,
            token: token,
            amount: amount,
            apiProduct: apiProducts[productId].name,
            timestamp: block.timestamp,
            requestId: requestId
        }));

        emit PaymentProcessed(msg.sender, token, amount, apiProducts[productId].name, requestId, block.timestamp);
    }

    function getProduct(uint256 productId) external view returns (APIProduct memory) {
        return apiProducts[productId];
    }

    function getUserStats(address user) external view returns (uint256 calls, uint256 spent) {
        return (userCallCount[user], userTotalSpent[user]);
    }

    function getRecentPayments(uint256 count) external view returns (Payment[] memory) {
        uint256 len = payments.length;
        uint256 returnCount = count > len ? len : count;
        Payment[] memory recent = new Payment[](returnCount);
        for (uint256 i = 0; i < returnCount; i++) {
            recent[i] = payments[len - 1 - i];
        }
        return recent;
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
