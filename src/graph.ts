import { RunnableConfig } from "@langchain/core/runnables";
import { AgentState, toolNode } from "./state/state";
import { createAgent } from "./utils/createAgent";
import openAIModel from "./common/model/openAI";
import path from "path";
import fs from "fs";
import {
  analysisAgentNode,
  runAgentNode,
} from "./nodes/agentNodes";
import { END, START, StateGraph } from "@langchain/langgraph";
import { routerNode } from "./router/router";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { retrieveMaterialTool } from "./tool/retrieveMaterialTool";
import { logger } from "./utils/logger";
import { visual } from "./utils/visualization";

const llm = openAIModel;

export const runGraph = async (prd: string) => {
  // 物料捞取节点
  const retrieveAgentNode = async (
    state: typeof AgentState.State,
    config?: RunnableConfig
  ) => {
    logger.info("[retrieveAgent] 开始创建 agent");
    const modulesAgent = await createAgent({
      llm,
      tools: [retrieveMaterialTool],
      systemMessage:
        fs.readFileSync(
          path.resolve(__dirname, "./prompts/retrieve.md"),
          "utf-8"
        ),
    });
    logger.info("[retrieveAgent] 开始调用 agent");
    return runAgentNode({
      state,
      agent: modulesAgent,
      name: "RetrieveMaterial",
      config,
    });
  };

  const workflow = new StateGraph(AgentState)
    // 2. 加入节点
    .addNode("RetrieveMaterial", retrieveAgentNode)
    .addNode("Analysis", analysisAgentNode)
    .addNode("Tools", toolNode);

  workflow.addConditionalEdges("RetrieveMaterial", routerNode, {
    // 我们将转换到另一个 agent
    continue: "Analysis",
    Tools: "Tools",
    end: "Analysis",
  });

  workflow.addConditionalEdges("Analysis", routerNode, {
    // 我们将转换到另一个 agent
    continue: "RetrieveMaterial",
    Tools: "Tools",
    end: END,
  });

  workflow.addConditionalEdges(
    "Tools",
    // 每个 agent 节点都会更新 'sender' 字段
    // 工具调用节点不会更新这个字段，这意味着
    // 这条边将路由回到最初调用工具的 agent
    (x) => x.sender,
    {
      RetrieveMaterial: "RetrieveMaterial",
    }
  );
  // 从物料捞Agent取开始
  workflow.addEdge(START, "RetrieveMaterial");

  const graph = workflow.compile();

  const streamResults = graph.stream(
    {
      messages: [
        new HumanMessage({
          content: `xx`,
        }),
      ],
    },
    { recursionLimit: 300 }
  );
  await visual(graph);

  const prettifyOutput = (output: Record<string, any>) => {
    const keys = Object.keys(output);
    const firstItem = output[keys[0]];

    // 打印完整的消息历史
    if ("messages" in firstItem && Array.isArray(firstItem.messages)) {
      logger.info("\n=== 对话历史 ===");
      firstItem.messages.forEach((message: BaseMessage, index: number) => {
        logger.info(`\n[消息 ${index + 1}]`);
        logger.info(`发送者: ${message.name || "系统"}`);
        logger.info(`类型: ${message._getType()}`);
        logger.info(`内容: ${message.content}`);
        if (message.tool_calls) {
          logger.info(`工具调用: `, message.tool_calls);
        }
        logger.info("-------------------");
      });
    }

    if ("sender" in firstItem) {
      logger.info(`当前发送者: ${firstItem.sender}\n`);
    }
  };
  // let finalResult = null;
  for await (const output of await streamResults) {
    if (!output?.__end__) {
      prettifyOutput(output);
      // finalResult = output;
    }
  }
  // 获取最终结果
  // if (finalResult) {
  //   const keys = Object.keys(finalResult);
  //   const firstItem = finalResult[keys[0]];
  //   if ('messages' in firstItem && Array.isArray(firstItem.messages)) {
  //     const lastMessage = firstItem.messages[firstItem.messages.length - 1];
  //    logger.info('\n=== 最终结果 ===');
  //    logger.info(lastMessage.content);
  //   }
  // }
};
