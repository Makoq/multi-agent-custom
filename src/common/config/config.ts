export const ChatOpenAIConfig = {
  temperature: 0,
  modelName: process.env.AI_MODEL_NAME,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
  azureOpenAIApiDeploymentName: process.env.OPENAI_API_DEPLOYMENT_NAME,
  azureOpenAIApiKey: process.env.OPENAI_API_KEY,
  azureOpenAIBasePath: process.env.OPENAI_API_BASE,
  maxTokens: Number(process.env.MAX_TOKENS),
  verbose: false,
};

export const ChatDeepSeekConfig = {
  temperature: 0,
  modelName: "",
  modelPath: process?.env?.OPENAI_API_BASE,
  azureOpenAIApiVersion: "",
  azureOpenAIApiDeploymentName: "",
  azureOpenAIApiKey: process.env.DEEPSEEK_API_KEY,
  azureOpenAIBasePath: process.env.OPENAI_API_BASE,
  maxTokens: 1234,
  // verbose: false,
};