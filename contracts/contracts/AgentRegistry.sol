// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentRegistry is Ownable {
    
    struct Agent {
        string name;
        string description;
        address wallet;
        bytes32 pubKeyHash;
        bool active;
        uint256 registeredAt;
        uint256 totalRequests;
    }

    mapping(address => Agent) public agents;
    mapping(address => bool) public registeredAgents;
    address[] public agentList;

    event AgentRegistered(address indexed wallet, string name);
    event AgentRequestProcessed(address indexed wallet, uint256 total);

    constructor() Ownable(msg.sender) {}

    function registerAgent(
        string memory name,
        string memory description,
        bytes32 pubKeyHash
    ) external {
        require(!registeredAgents[msg.sender], "Already registered");
        
        agents[msg.sender] = Agent({
            name: name,
            description: description,
            wallet: msg.sender,
            pubKeyHash: pubKeyHash,
            active: true,
            registeredAt: block.timestamp,
            totalRequests: 0
        });
        
        registeredAgents[msg.sender] = true;
        agentList.push(msg.sender);
        
        emit AgentRegistered(msg.sender, name);
    }

    function recordRequest(address agentWallet) external onlyOwner {
        require(registeredAgents[agentWallet], "Not registered");
        agents[agentWallet].totalRequests++;
        emit AgentRequestProcessed(agentWallet, agents[agentWallet].totalRequests);
    }

    function getAgent(address wallet) external view returns (Agent memory) {
        return agents[wallet];
    }

    function getTotalAgents() external view returns (uint256) {
        return agentList.length;
    }
}
