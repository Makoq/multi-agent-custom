import { ConsoleCallbackHandler, Run } from 'langchain/callbacks';
import fs from 'fs';
import { Serialized } from '@langchain/core/load/serializable';
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';

const logFile = `./archive-log/${Date.now()}_model_invoke_logs.json`;

// 扩展 ConsoleCallbackHandler
export class RFAIAppFileLoggingCallbackHandler extends BaseCallbackHandler {
  logFile = '';
  logStream;
  name = 'custom_log_handler';
  constructor(logFile) {
    super();
    this.logFile = logFile;
    this.logStream = fs.createWriteStream(logFile, { flags: 'a' }); // 创建文件写入流
  }

  logToFile(entry) {
    const logEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    this.logStream.write(JSON.stringify(logEntry, null, 2) + '\n');
  }

  // 捕获 LLM 开始事件
  handleLLMStart(llm: Serialized, prompts: string[], runId: string) {
    this.logToFile({
      event: 'LLM Start',
      runId,
      llm,
      prompts,
    });
  }

  // 捕获 LLM 结束事件
  handleLLMEnd(output, runId) {
    this.logToFile({
      event: 'LLM End',
      runId,
      output,
    });

    // 返回 Run 对象
    return {
      id: runId,
      endTime: new Date().toISOString(),
      status: 'completed',
      output,
    };
  }

  // 捕获 LLM 错误事件
  handleLLMError(error, runId) {
    this.logToFile({
      event: 'LLM Error',
      runId,
      error: error.message,
    });
  }

  close() {
    this.logStream.end(); // 关闭文件流
  }
}

export const logHandler = new RFAIAppFileLoggingCallbackHandler(logFile);
