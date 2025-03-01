export const wagmiContractConfig = {
  address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "agentId",
          type: "uint8",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          internalType: "string",
          name: "image",
          type: "string",
        },
        {
          internalType: "string[]",
          name: "traits",
          type: "string[]",
        },
      ],
      name: "addAgent",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      name: "agents",
      outputs: [
        {
          internalType: "uint8",
          name: "agentId",
          type: "uint8",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          internalType: "string",
          name: "image",
          type: "string",
        },
        {
          internalType: "bool",
          name: "eliminated",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "agentsByGame",
      outputs: [
        {
          internalType: "uint8",
          name: "agentId",
          type: "uint8",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          internalType: "string",
          name: "image",
          type: "string",
        },
        {
          internalType: "bool",
          name: "eliminated",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint8[]",
          name: "agentIds",
          type: "uint8[]",
        },
        {
          internalType: "string",
          name: "uuid",
          type: "string",
        },
      ],
      name: "createGameRoom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "eliminateAgentId",
          type: "uint8",
        },
        {
          internalType: "string",
          name: "gameId",
          type: "string",
        },
      ],
      name: "eliminatePlayer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      name: "eliminatedInGame",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "gameCount",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      name: "gameRooms",
      outputs: [
        {
          internalType: "string",
          name: "gameId",
          type: "string",
        },
        {
          internalType: "bool",
          name: "gameStarted",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "gameEnded",
          type: "bool",
        },
        {
          internalType: "uint8",
          name: "currentRound",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "gamesByUser",
      outputs: [
        {
          internalType: "string",
          name: "gameId",
          type: "string",
        },
        {
          internalType: "bool",
          name: "gameStarted",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "gameEnded",
          type: "bool",
        },
        {
          internalType: "uint8",
          name: "currentRound",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "gameId",
          type: "string",
        },
      ],
      name: "getActivePlayers",
      outputs: [
        {
          components: [
            {
              internalType: "uint8",
              name: "agentId",
              type: "uint8",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "string",
              name: "image",
              type: "string",
            },
            {
              internalType: "string[]",
              name: "traits",
              type: "string[]",
            },
            {
              internalType: "bool",
              name: "eliminated",
              type: "bool",
            },
          ],
          internalType: "struct SquidChain.Agent[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "gameId",
          type: "string",
        },
      ],
      name: "getAllAgentsByGameId",
      outputs: [
        {
          components: [
            {
              internalType: "uint8",
              name: "agentId",
              type: "uint8",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "string",
              name: "image",
              type: "string",
            },
            {
              internalType: "string[]",
              name: "traits",
              type: "string[]",
            },
            {
              internalType: "bool",
              name: "eliminated",
              type: "bool",
            },
          ],
          internalType: "struct SquidChain.Agent[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGameCount",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "gameId",
          type: "string",
        },
      ],
      name: "getGameRoomById",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "gameId",
              type: "string",
            },
            {
              internalType: "bool",
              name: "gameStarted",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "gameEnded",
              type: "bool",
            },
            {
              internalType: "uint8",
              name: "currentRound",
              type: "uint8",
            },
          ],
          internalType: "struct SquidChain.GameRoom",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "userAddress",
          type: "address",
        },
      ],
      name: "getGameRoomsByUser",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "gameId",
              type: "string",
            },
            {
              internalType: "bool",
              name: "gameStarted",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "gameEnded",
              type: "bool",
            },
            {
              internalType: "uint8",
              name: "currentRound",
              type: "uint8",
            },
          ],
          internalType: "struct SquidChain.GameRoom[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
} as const;
