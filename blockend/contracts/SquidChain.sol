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

    event TreasureHunted(address indexed player, bytes32 txHash);

    constructor() {
        addAgent(1, "Player 001", "The mysterious elderly contestant with a hidden agenda.", "/images/circle-red-preview.png", new string[](3));
        addAgent(2, "Player 067", "A determined North Korean defector, skilled in survival.", "/images/triangle-red-preview.png", new string[](3));
        addAgent(3, "Player 456", "The desperate but kind-hearted protagonist with a gambler's luck.", "/images/circle-red-preview.png", new string[](3));
        addAgent(4, "Player 218", "A brilliant but morally conflicted strategist, willing to do anything to win.", "/images/square-red-preview.png", new string[](3));
        addAgent(5, "Player 199", "A kind-hearted migrant worker with exceptional strength and loyalty.", "/images/circle-red-preview.png", new string[](3));
        addAgent(6, "Player 101", "A violent gangster with a short temper and a taste for chaos.", "/images/triangle-red-preview.png", new string[](3));
        addAgent(7, "Player 212", "A loud and unpredictable wildcard who plays mind games.", "/images/square-red-preview.png", new string[](3));
        addAgent(8, "Player 240", "A quiet but brave contestant with a tragic backstory.", "/images/circle-red-preview.png", new string[](3));

        agents[1].traits = ["Mastermind", "Deceptively Weak", "Cunning"];
        agents[2].traits = ["Resourceful", "Brave", "Elusive"];
        agents[3].traits = ["Lucky", "Empathetic", "Unpredictable"];
        agents[4].traits = ["Calculating", "Manipulative", "Determined"];
        agents[5].traits = ["Strong", "Trustworthy", "Naive"];
        agents[6].traits = ["Aggressive", "Unpredictable", "Ruthless"];
        agents[7].traits = ["Manipulative", "Flamboyant", "Survivor"];
        agents[8].traits = ["Selfless", "Courageous", "Loyal"];
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

    function getActiveAgents(string memory gameId) public view returns (Agent[] memory) {
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

    function getEliminatedAgents(string memory gameId) public view returns (Agent[] memory) {
        Agent[] storage gameAgents = agentsByGame[gameId];
        uint eliminatedCount = 0;

        for (uint i = 0; i < gameAgents.length; i++) {
            if (eliminatedInGame[gameId][gameAgents[i].agentId]) {
                eliminatedCount++;
            }
        }

        Agent[] memory eliminatedAgents = new Agent[](eliminatedCount);
        uint index = 0;

        for (uint i = 0; i < gameAgents.length; i++) {
            if (eliminatedInGame[gameId][gameAgents[i].agentId]) {
                eliminatedAgents[index] = gameAgents[i];
                index++;
            }
        }

        return eliminatedAgents;
    }

    function treasureHunt() public returns (string memory) {
        emit TreasureHunted(msg.sender, keccak256(abi.encodePacked(msg.sender, block.timestamp, blockhash(block.number - 1))));
        return "winner";
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
