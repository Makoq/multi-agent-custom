import { ChatOpenAI } from "@langchain/openai";
import { ChatDeepSeekConfig } from "../config/config";

export default new ChatOpenAI(ChatDeepSeekConfig);
