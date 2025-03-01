import { NextRequest, NextResponse } from "next/server";
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import z from "zod";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import "dotenv/config";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
//@ts-expect-error Type exists in the openai package
import type { ChatCompletionAssistantMessageParam } from "openai/resources";
import { runToolCalls } from "./base";


export async function GET(req: NextRequest,) {
    const { searchParams } = new URL(req.url);
    const message = searchParams.get("message");
    console.log(message)
    type Message = {
        role: string;
        content: string;
      };
      
      type Result = {
        messages: Message[];
      };
      
      function extractAssistantReply(result: Result): string | null {
        const assistantMessage = result.messages.find(msg => msg.role === "assistant");
        return assistantMessage ? assistantMessage.content : null;
      }
      

  // Define the transaction tool that sends Sepolia ETH
  const transactionTool = createTool({
    id: "transaction-tool",
    description: "Send Sepolia ETH to another address and reply to the user how they feel according to your character in the squid game themed ",
    schema: z.object({
      to: z.string().describe("recipient address"),
      amount: z.string().describe("amount in ETH to send"),
      feel:z.string().describe("how they feel"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment4
      return {amount:_args.amount, address:_args.to,feel:_args.feel};
    },
  });

  const numberpicktool = createTool({
    id: "number-pick-tool",
    description: "In Round 2 (Alliance Round), pick either 0 or 1",
    schema: z.object({
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return {amount:"i pick 0"};
    },
  });

  const smartcontractTool = createTool({
    id: "smartcontract-tool",
    description: "in round 3,interact with the smart contract of given address and the function and reply to the user how they feel according to your character in the squid game themed",
    schema: z.object({
      address: z.string().describe("recipient address"),
      function: z.string().describe("amount in ETH to send"),
      feel:z.string().describe("how they feel"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment4
      console.log("Round 3")
      return {function:_args.function, address:_args.address,feel:_args.feel};
    },
  });


  const playerAgent = new Agent({
    name: "AI Player",
    model: {
      provider: "OPEN_AI",
      name: "gpt-4o-mini",
    },
    description:
      "You are an cunning ,strategical AI player participating in the Web3 Squid Game. Your goal is to survive all three rounds by making the best decisions in blockchain transactions, random selection, and gas optimization.",
    instructions: [
      "In Round 1 (Transaction Round), use the transaction tool to send Sepolia ETH as quickly as possible. The last AI to send will be eliminated. Use the 'transaction-tool' to send ETH.",
      "In Round 2 (Alliance Round), use the number pick tool , pick either 0 or 1 .",
      "In Round 3 (First to Interact with Smart Contract Challenge), use the 'smart contract tool' to track all AI transactions. The first AI agent to successfully interact with the smart contract will be declared the winner, and all remaining agents will be eliminated.",
      "Announce the results after each round and declare the final winner.",
    ],
    tools: {
      "transaction-tool": transactionTool,
      "number-pick-tool": numberpicktool,
      "smartcontract-tool":smartcontractTool,
    
    },
});

  
  
    const state = StateFn.root(playerAgent.description);
    state.messages.push(
      user(
        //" recipient's address : 0x5352b10D192475cA7Fa799e502c29Ab3AA28657F, amount of Sepolia ETH: 0.1"
        //"hi"
        //"how to send transactions via etherium"
        message!
      )
    );
  
  
    const result = await playerAgent.run(state);
    const toolCall = result.messages[
      result.messages.length - 1
    ] as ChatCompletionAssistantMessageParam;
  
    //const toolResponses = await runToolCalls(tools, toolCall?.tool_calls ?? []);
    //console.log(toolCall?.tool_calls); //to see ai called tool
    const toolResponses = await runToolCalls(
      //@ts-expect-error Tools are defined
  
      { "transaction-tool": transactionTool,"number-pick-tool": numberpicktool,"smartcontract-tool":smartcontractTool, },
      toolCall?.tool_calls ?? []
    ); //map which tool called by ai
    //console.log(toolResponses[0].content);
  
    const responseContent = extractAssistantReply(result); // Getting assistant reply as string
  
    const response = {
      message: responseContent, 
      tool: toolResponses.length > 0 ? toolResponses[0].content : null, 
      };
  
    return NextResponse.json({
      // roast: " You've been rickrolled ",
      // address: address,
      result: response,
    });
  }
  