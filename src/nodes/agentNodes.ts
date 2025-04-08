import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { AgentState } from '../state/state';
import { createAgent } from '../utils/createAgent';
import fs from 'fs';
import path from 'path';
import { HumanMessage } from '@langchain/core/messages';
import llm from '@/common/model/openAI';
import { logger } from '../utils/logger';

// 运行节点
export async function runAgentNode(props: {
  state: typeof AgentState.State;
  agent: Runnable;
  name: string;
  config?: RunnableConfig;
}) {
  const { state, agent, name, config } = props;
  logger.info(`[${name}] 开始处理，输入状态：`, state);
  let result = await agent.invoke(state, config);
  logger.info(`[${name}] 调用 agent.invoke 后结果：`, result);
  // 将 agent 输出转换为适合附加到全局状态的格式
  if (!result?.tool_calls || result.tool_calls.length === 0) {
    // 如果 agent 没有调用工具，将其转换为人类消息格式
    result = new HumanMessage({ ...result, name });
    logger.info(`[${name}] 没有 tool_calls，转换为 HumanMessage：`, result);
  }
  logger.info(`[${name}] 最终返回结果：`, { messages: [result], sender: name });
  return {
    messages: [result],
    // 明确发送者以便知道下一步要传递给谁
    sender: name,
  };
}

// 分析节点
export async function analysisAgentNode(state: typeof AgentState.State, config?: RunnableConfig) {
  logger.info('[analysis] 开始创建 agent');
  const analysisAgent = await createAgent({
    llm,
    tools: [],
    systemMessage: fs.readFileSync(path.resolve(__dirname, '../prompts/analysis.md'), 'utf-8'),
  });
  logger.info('[analysis] Agent 创建成功，开始调用 runAgentNode');
  return runAgentNode({
    state,
    agent: analysisAgent,
    name: 'Analysis',
    config,
  });
}
