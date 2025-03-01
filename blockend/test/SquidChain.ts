import { ethers } from "hardhat";
import { v4 as uuidv4 } from "uuid";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("SquidChain", function () {
  // Deploy the SquidChain contract
  async function deploySquidChainFixture() {
    const [user] = await ethers.getSigners();
    const SquidChain = await ethers.getContractFactory("SquidChain");
    const squidChain = await SquidChain.deploy();
    return { squidChain, user };
  }

  describe("Game Room Management", function () {
    it("should create a new game room", async function () {
      const { squidChain } = await loadFixture(deploySquidChainFixture);
      const gameId = uuidv4();
      const playerIds = [1, 2, 3];
      await squidChain.createGameRoom(playerIds, gameId);

      const gameRoom = await squidChain.gameRooms(gameId);
      console.log("Game Room:", gameRoom);

      expect(gameRoom.gameId).to.equal(gameId);
    });

    it("should return the correct game count", async function () {
      const { squidChain } = await loadFixture(deploySquidChainFixture);

      await squidChain.createGameRoom([1], uuidv4());

      const gameCount = await squidChain.getGameCount();
      expect(gameCount).to.equal(1);
    });
  });

  describe("Agent Management", function () {
    it("should add an agent to the game", async function () {
      const { squidChain } = await loadFixture(deploySquidChainFixture);

      await squidChain.addAgent(4, "Agent 4", "Description 4", "Image 4", [
        "trait1",
        "trait2",
      ]);

      const agent = await squidChain.agents(4);

      expect(agent.agentId).to.equal(4);
      expect(agent.name).to.equal("Agent 4");
      expect(agent.description).to.equal("Description 4");
      expect(agent.eliminated).to.equal(false);
    });

    it("should eliminate a player from the game", async function () {
      const { squidChain } = await loadFixture(deploySquidChainFixture);

      const gameId = uuidv4();
      await squidChain.createGameRoom([1, 2], gameId);

      await squidChain.eliminatePlayer(1, gameId);

      const activeAgents = await squidChain.getActiveAgents(gameId);

      expect(activeAgents.length).to.equal(1);
      expect(activeAgents[0].agentId).to.equal(2);
    });
  });

  describe("Active Agents", function () {
    it("should return only active players", async function () {
      const { squidChain } = await loadFixture(deploySquidChainFixture);

      const gameId = uuidv4();
      await squidChain.createGameRoom([1, 2, 3], gameId);

      await squidChain.eliminatePlayer(1, gameId);

      const activeAgents = await squidChain.getActiveAgents(gameId);
      console.log("Active Agents:", activeAgents);

      expect(activeAgents.length).to.equal(2);
      expect(activeAgents[0].agentId).to.equal(2);
      expect(activeAgents[1].agentId).to.equal(3);
    });
  });

  describe("Eliminated Agents", function () {
    it("should return only eliminated players", async function () {
      const { squidChain } = await loadFixture(deploySquidChainFixture);

      const gameId = uuidv4();
      await squidChain.createGameRoom([1, 2, 3], gameId);
      await squidChain.eliminatePlayer(1, gameId);
      await squidChain.eliminatePlayer(2, gameId);

      const eliminatedAgents = await squidChain.getEliminatedAgents(gameId);
      console.log("Eliminated Agents:", eliminatedAgents);

      expect(eliminatedAgents.length).to.equal(2);
      expect(eliminatedAgents[0].agentId).to.equal(1);
      expect(eliminatedAgents[1].agentId).to.equal(2);
    });
  });

  describe("Game Rooms created by user", function () {
    it("should return the game rooms created by a user", async function () {
      const { squidChain, user } = await loadFixture(deploySquidChainFixture);

      const game1Id = uuidv4();
      await squidChain.createGameRoom([1, 2], game1Id);

      await squidChain.eliminatePlayer(1, game1Id);

      const game2Id = uuidv4();

      await squidChain.createGameRoom([1, 2], game2Id);

      const userAddress = await user.getAddress();

      console.log("User Address:", userAddress);
      const gameRooms = await squidChain.getGameRoomsByUser(userAddress);
      gameRooms.map(async (gameRoom) => {
        console.log("Game ID: ", gameRoom.gameId.toString());
        // console.log("Agents");

        // const agents = await squidChain.getActiveAgents(
        //   Number(gameRoom.gameId.toString())
        // );

        // console.log(agents);
      });

      const agents = await squidChain.getActiveAgents(game1Id);
      console.log("Active agents in 1 :", agents);

      const agents2 = await squidChain.getActiveAgents(game2Id);
      console.log("Active agents in 2 :", agents2);
    });
  });
});
