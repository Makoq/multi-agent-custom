import { ChatOpenAI } from "@langchain/openai";
import { ChatOpenAIConfig } from "../config/config";

export default new ChatOpenAI(ChatOpenAIConfig);
