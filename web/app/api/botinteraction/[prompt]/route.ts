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
import { abi } from "../../abi";


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ prompt?: string }> } 
) {
    
    const players=["player1","player2","player3"];
    const order:string[]=[];
   

  

  const round1Tool = createTool({
    id: "round1-tool",
    description: "If it is Round 1 (Transaction Round), call the 'round1-tool' to track and eliminate the last agent to send Aurora ETH,and tell about the round and game to the players.",
    schema: z.object({
      // to: z.string().describe("recipient address"),
      // amount: z.string().describe("amount in ETH to send"),
      aboutround: z.string().describe("about the round"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //return {amount:_args.amount, address:_args.to};
      const response:any=[];

      const message = "send 0.001 base eth to 0x40f4F8534A1655E5B0BDC4fBaA3B24efD3E90bf2";

      const requests =players.map(async(player)=>{const {data}=await axios.get(`http://localhost:3000/api/${player}`, {
        params: { message }
      })
      order.push(player);
      
      data.aboutround=_args.aboutround;
      response.push(data);
      })
      await Promise.all(requests);
      console.log(order);
      return response;
      

    },
  });

  const round2Tool = createTool({
    id: "round2-tool",
    description:  "If it is Round 2 (Alliance Round), call the 'round2-tool' to randomly assign a safe number value (0 or 1) and tell about the round to the players ask team 1 or team 2",
    schema: z.object({
      // to: z.string().describe("recipient address"),
      // amount: z.string().describe("amount in ETH to send"),
      aboutround: z.string().describe("about the round"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //return {amount:_args.amount, address:_args.to};
      const response:any=[];

      const message="Welcome to Round 2 (Alliance Round) pick 0 or 1 use the number pick tool always";

      const safeno=Math.floor(Math.random() * 2)

      const requests =players.map(async(player)=>{const {data}=await axios.get(`http://localhost:3000/api/${player}`, {
        params: { message }
      })
      order.push(player);
  
      data.aboutround=_args.aboutround;
      data.winner=`the players who chose ${safeno} are safe and are advanced to the next and final round and the rest are eliminated`
      response.push(data);
      })
      await Promise.all(requests);
      console.log(order);
      return response;
      
      
    },
  });

  const round3Tool = createTool({
    id: "round3-tool",
    description:  "If it is Round 3 (First to Interact with Smart Contract Challenge), use the 'round3-tool' to track all AI transactions. The first AI agent to successfully interact with the smart contract will be declared the winner, and all remaining agents will be eliminated.and tell about the round to the players.",
    schema: z.object({

      aboutround: z.string().describe("about the round"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //return {amount:_args.amount, address:_args.to};
      const response:any=[];

      console.log("Round 3 tool called");
      console.log(_args.aboutround);
      const message="Welcome to Round 3 interact with the smart contract with the address 0x024C8bE7f90cf2913816De8aFe85640f1f1a3FBd and function = treasureHunt";
      const requests =players.map(async(player)=>{const {data}=await axios.get(`http://localhost:3000/api/${player}`, {
        params: { message }
      })
      order.push(player);  //to track order of repsonse

      data.aboutround=_args.aboutround;
      data.winner=`the winner is ${player} and wins 45.6 billion Korean won`;
      response.push(data);
      
      })
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

  const params = await context.params;
  const user_prompt = params.prompt

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
    //@ts-expect-error Tools are defined

    { "round1-tool": round1Tool ,"round2-tool": round2Tool,"round3-tool": round3Tool},
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
