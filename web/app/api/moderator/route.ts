import { NextRequest, NextResponse } from "next/server";
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import z from "zod";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import "dotenv/config";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
//@ts-expect-error Type exists in the openai package
import type { ChatCompletionAssistantMessageParam } from "openai/resources";
import { runToolCalls } from "./base";
import axios from "axios";
import { AgentCardProps } from "@/lib/interface";
import { ethers } from "ethers";
import { abi } from "../abi";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { activeAgents, round, gameId } = body;

  const playerIds = activeAgents.map((agent: AgentCardProps) => agent.agentId);

  const order: string[] = [];

  const eliminatePlayer = async (playerId: number, gameId: number) => {
    try {
        const provider = new ethers.JsonRpcProvider("https://testnet.aurora.dev");
        const wallet = new ethers.Wallet(process.env.agentprivatekey!, provider);

        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, abi, wallet);

        const tx = await contract.eliminatePlayer(playerId, gameId);
        await tx.wait();

        console.log(`Player ${playerId} eliminated from Game ${gameId}. TxHash: ${tx.hash}`);
        return tx.hash;
    } catch (error) {
        console.error("Error eliminating player:", error);
        throw error;
    }
};




  const round1Tool = createTool({
    id: "round1-tool",
    description:
      "If it is Round 1 (Transaction Round), call the 'round1-tool' to track and eliminate the last agent to send Aurora ETH,and tell about the round and game to the players.",
    schema: z.object({
      // to: z.string().describe("recipient address"),
      // amount: z.string().describe("amount in ETH to send"),
      aboutround: z.string().describe("about the round"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //return {amount:_args.amount, address:_args.to};
      const response: any = [];

      const message =
        "send 0.001 base eth to 0x40f4F8534A1655E5B0BDC4fBaA3B24efD3E90bf2";

      const requests = playerIds.map(async (playerId: number) => {
        const { data } = await axios.get(
          `http://localhost:3000/api/player${playerId}`,
          {
            params: { message },
          }
        );
        order.push(`player${playerId}`);

        data.aboutround = _args.aboutround;
        data.eventname="send aurora eth to the wallet address";
        data.eventdesc="sent 0.001 aurora eth to the wallet address";
        response.push(data);
      });
      await Promise.all(requests);
      console.log(order);
      return response;
    },
  });

  const round2Tool = createTool({
    id: "round2-tool",
    description:
      "If it is Round 2 (Alliance Round), call the 'round2-tool' to randomly assign a safe number value (0 or 1) and tell about the round to the players ask team 1 or team 2",
    schema: z.object({
      // to: z.string().describe("recipient address"),
      // amount: z.string().describe("amount in ETH to send"),
      aboutround: z.string().describe("about the round"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //return {amount:_args.amount, address:_args.to};
      const response: any = [];

      const message =
        "Welcome to Round 2 (Alliance Round) pick 0 or 1 use the number pick tool always";

      const safeno = Math.floor(Math.random() * 2);

      const requests = playerIds.map(async (playerId: number) => {
        const { data } = await axios.get(
          `http://localhost:3000/api/player${playerId}`,
          {
            params: { message },
          }
        );
        order.push(`player${playerId}`);

        data.aboutround = _args.aboutround;
        data.eventname="Form alliances with other players";
        data.eventdesc="alliance formed with other players";
        data.winner = `the players who chose ${safeno} are safe and are advanced to the next and final round and the rest are eliminated`;
        response.push(data);
      });
      await Promise.all(requests);
      console.log(order);
      return response;
    },
  });

  const round3Tool = createTool({
    id: "round3-tool",
    description:
      "If it is Round 3 (First to Interact with Smart Contract Challenge), use the 'round3-tool' to track all AI transactions. The first AI agent to successfully interact with the smart contract will be declared the winner, and all remaining agents will be eliminated.and tell about the round to the players.",
    schema: z.object({
      aboutround: z.string().describe("about the round"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //return {amount:_args.amount, address:_args.to};
      const response: any = [];

      console.log("Round 3 tool called");
      console.log(_args.aboutround);
      const message =
        "Welcome to Round 3 interact with the smart contract with the address 0x024C8bE7f90cf2913816De8aFe85640f1f1a3FBd and function = treasureHunt";

      const requests = playerIds.map(async (playerId: number) => {
        const { data } = await axios.get(
          `http://localhost:3000/api/player${playerId}`,
          {
            params: { message },
          }
        );
        order.push(`player${playerId}`);

        data.aboutround = _args.aboutround;
        data.eventname="Interact with the smart contract";
        data.eventdesc="Interacted with the smart contract";
        data.winner = `the winner is Player${playerId} and wins 45.6 billion Korean won`;
        response.push(data);
      });
      await Promise.all(requests);
      console.log(order);
      return response[0];
    },
  });

  const moderatorAgent = new Agent({
    name: "Squid Game Moderator",
    model: {
      provider: "OPEN_AI",
      name: "gpt-4o-mini",
    },
    description:
      "You are the Squid Game Moderator AI, responsible for enforcing the rules and eliminating AI agents based on their performance in each round. You manage three rounds of the Web3 Squid Game and decide which AI agents advance or get eliminated.",
    instructions: [
      "Monitor and enforce the rules for each round based on the provided game phase.",
      "If it is Round 1 (Transaction Round), call the 'round1-tool' to track and eliminate the last agent to send Aurora ETH.",
      "If it is Round 2 (Alliance Round), call the 'round2-tool' to randomly assign a safe number value (0 or 1) and tell about the round to the players ask team 1 or team 2",
      "If it is Round 3 (First to Interact with Smart Contract Challenge), use the 'round3-tool' to track all AI transactions. The first AI agent to successfully interact with the smart contract will be declared the winner, and all remaining agents will be eliminated.",
      "Announce the results after each round and declare the final winner.",
    ],
    tools: {
      "round1-tool": round1Tool, // Tool to check last ETH transaction and eliminate
      "round2-tool": round2Tool, // Tool to assign safe number and eliminate wrong picks
      "round3-tool": round3Tool, // Tool to evaluate gas optimization and eliminate weak agents
    },
  });

  const user_prompt = round;

  const state = StateFn.root(moderatorAgent.description);
  state.messages.push(
    user(
      //" recipient's address : 0x5352b10D192475cA7Fa799e502c29Ab3AA28657F, amount of Sepolia ETH: 0.1"
      //"hi"
      //"how to send transactions via etherium"
      user_prompt
    )
  );

  const result = await moderatorAgent.run(state);
  const toolCall = result.messages[
    result.messages.length - 1
  ] as ChatCompletionAssistantMessageParam;

  //const toolResponses = await runToolCalls(tools, toolCall?.tool_calls ?? []);
  //console.log(toolCall?.tool_calls); //to see ai called tool
  const toolResponses = await runToolCalls(
    {
      "round1-tool": round1Tool,
      "round2-tool": round2Tool,
      "round3-tool": round3Tool,
    },
    toolCall?.tool_calls ?? []
  ); //map which tool called by ai
  //console.log(toolResponses[0].content);

  const response = {
    tool: toolResponses.length > 0 ? toolResponses[0].content : null,
  };

  return NextResponse.json({
    // roast: " You've been rickrolled ",
    // address: address,
    result: response.tool,
  });
}
