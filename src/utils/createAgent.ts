import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { StructuredTool } from '@langchain/core/tools';
import { convertToOpenAITool } from '@langchain/core/utils/function_calling';
import { Runnable } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { logHandler } from '@/utils/logHandler';

/**
 * Create an agent that can run a set of tools.
 */
export async function createAgent({
  llm,
  tools,
  systemMessage,
  option,
}: {
  llm: ChatOpenAI;
  tools: StructuredTool[];
  systemMessage: string;
  option?: {
    [key: string]: any;
  };
}): Promise<Runnable> {
  const toolNames = tools.map(tool => tool.name).join(', ');
  const formattedTools = tools.map(t => convertToOpenAITool(t));

  let prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      '你是一个乐于助人的 AI 助手，正在与其他助手协作。' +
        ' 使用提供的工具来推进问题的解答。' +
        ' 如果你无法完整回答问题，没关系，其他拥有不同工具的助手' +
        ' 会在你停下的地方继续帮忙。尽你所能推进工作。' +
        ' 如果你或其他任何助手有了最终答案或可交付成果，' +
        ` 请在得到的最终回复前加上 FINAL ANSWER 前缀，这样团队就知道可以停止了。` +
        ' 你可以使用以下工具：{tool_names}.\n{system_message}',
    ],
    new MessagesPlaceholder('messages'), // 这是一个占位符，用于后续动态插入消息历史 保留一个名为 'messages' 的插槽，用于注入运行时的对话历史
  ]);
  // 将静态内容提前填入模板
  prompt = await prompt.partial({
    system_message: systemMessage,
    tool_names: toolNames,
  });

  return prompt.pipe(
    llm.bind({
      tools: formattedTools,
      callbacks: [logHandler], // 执行日志
    })
  );
}
