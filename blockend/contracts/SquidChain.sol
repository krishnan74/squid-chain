// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SquidChain {
    struct Agent {
        uint8 agentId;
        string name;
        string description;
        string image;
        string[] traits;
        bool eliminated;
    }

    struct GameRoom {
        string gameId;
        bool gameStarted;
        bool gameEnded;
        uint8 currentRound;
    }

    uint8 public gameCount;
    mapping(address => GameRoom[]) public gamesByUser;
    mapping(string => GameRoom) public gameRooms;
    mapping(uint8 => Agent) public agents;
    mapping(string => mapping(uint8 => bool)) public eliminatedInGame; 
    mapping(string => Agent[]) public agentsByGame;

    constructor() {
        string[] memory traits1 = new string[](2);
        traits1[0] = "trait1";
        traits1[1] = "trait2";
        addAgent(1, "Agent 1", "Description 1", "image1", traits1);

        string[] memory traits2 = new string[](2);
        traits2[0] = "trait1";
        traits2[1] = "trait2";
        addAgent(2, "Agent 2", "Description 2", "image1", traits2);

        string[] memory traits3 = new string[](2);
        traits3[0] = "trait1";
        traits3[1] = "trait2";
        addAgent(3, "Agent 3", "Description 3", "image1", traits3);
    }

    function addAgent(uint8 agentId, string memory name, string memory description, string memory image, string[] memory traits) public {
        agents[agentId] = Agent(agentId, name, description, image, traits, false);
    }


    function createGameRoom(uint8[] memory agentIds, string memory uuid) public {
        gameCount++;
        GameRoom storage gameRoom = gameRooms[uuid];
        gameRoom.gameId = uuid;
        gameRoom.gameStarted = false;
        gameRoom.gameEnded = false;
        gameRoom.currentRound = 0;

        for (uint i = 0; i < agentIds.length; i++) {
            require(agents[agentIds[i]].agentId != 0, "Agent does not exist");

            Agent memory agentCopy = agents[agentIds[i]];
            agentsByGame[gameRoom.gameId].push(agentCopy);
            eliminatedInGame[gameRoom.gameId][agentCopy.agentId] = false; // Ensure the agent starts as active
        }

        gamesByUser[msg.sender].push(gameRoom);
    }

    function eliminatePlayer(uint8 eliminateAgentId, string memory gameId) public {
        require(agents[eliminateAgentId].agentId != 0, "Agent does not exist");
        require(!eliminatedInGame[gameId][eliminateAgentId], "Agent is already eliminated in this game");

        Agent[] storage gameAgents = agentsByGame[gameId];
        for (uint i = 0; i < gameAgents.length; i++) {
            if (gameAgents[i].agentId == eliminateAgentId) {
                gameAgents[i].eliminated = true;
                eliminatedInGame[gameId][eliminateAgentId] = true; // Mark eliminated only in this game
                break;
            }
        }
    }

    function getActivePlayers(string memory gameId) public view returns (Agent[] memory) {
        Agent[] storage gameAgents = agentsByGame[gameId];
        uint activeCount = 0;

        for (uint i = 0; i < gameAgents.length; i++) {
            if (!eliminatedInGame[gameId][gameAgents[i].agentId]) {
                activeCount++;
            }
        }

        Agent[] memory activeAgents = new Agent[](activeCount);
        uint index = 0;

        for (uint i = 0; i < gameAgents.length; i++) {
            if (!eliminatedInGame[gameId][gameAgents[i].agentId]) {
                activeAgents[index] = gameAgents[i];
                index++;
            }
        }

        return activeAgents;
    }

    function getAllAgentsByGameId(string memory gameId) public view returns (Agent[] memory) {
        return agentsByGame[gameId];
    }

    function getGameRoomById(string memory gameId) public view returns (GameRoom memory) {
        return gameRooms[gameId];
    }

    function getGameRoomsByUser(address userAddress) public view returns (GameRoom[] memory) {
        return gamesByUser[userAddress];
    }

    function getGameCount() public view returns (uint8) {
        return gameCount;
    }
}
