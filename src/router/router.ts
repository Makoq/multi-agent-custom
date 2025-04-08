import { AgentState } from "../state/state";

export function routerNode(state: typeof AgentState.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];

  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    // 上一个 agent 正在调用工具
    return "Tools";
  }
  if (
    typeof lastMessage.content === "string" &&
    lastMessage.content.includes("FINAL ANSWER")
  ) {
    // 任何 agent 带着FINAL ANSWER的 决定工作已完成
    return "end";
  }

  return "continue";
}
