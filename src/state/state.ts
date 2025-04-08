import { END, Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";

import { retrieveMaterialTool } from "../tool/retrieveMaterialTool";

// 每个node之间传递的对象
// 每个node是一个agent和tool
export const AgentState = Annotation.Root({
  // 所有的消息
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  // 上一个工作的node
  sender: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "user",
    default: () => "user",
  }),
  // 最后一个工作的node
  next: Annotation<string>({
    reducer: (x, y) => y ?? x ?? END,
    default: () => END,
  }),
});

const tools = [retrieveMaterialTool];
// 工具节点
export const toolNode = new ToolNode<typeof AgentState.State>(tools);
