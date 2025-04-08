import { runGraph } from '@/graph';
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ChatOpenAIConfig } from '@/common/config/config';
import llm from '@/common/model/openAI';

describe("Agent Tests", () => {
  it.skip("test", async () => {
    console.log(ChatOpenAIConfig);
    await runGraph('');
    console.log("done");
  });
  //测试模型
  it("test", async () => {
    const re= await llm.invoke([
      ["system", '你是一个翻译器'],
      ["human", '你好,翻译一下“锦衣卫”'],
    ]);
    console.log(re);
  })

});
