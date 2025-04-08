<a name="中文"></a>
 <div align="center">
  <h1>基于langChainJs、langGraphJs的多智能体开发框架</h1>
</div>

## 🌟 特点
- 集成了持久化日志
- langGraph节点可视化
- 配置文件化
- 基于vitest的单测能力
- 清晰的项目结构，配置化、可视化、日志化等工程能力，开箱即用

## 📂 目录结构
```
.
├── src/
│   ├── common/ langGraph节点
│       └── config 模型配置
│       └── config 模型，如deepseek和gpt
│   ├── nodes/ langGraph节点
│   ├── prompts/ langChain prompt
│   ├── router/ langGraph路由
│   ├── state/  langGraph状态
│   ├── tool/ langChain工具
│   ├── utils/ langChain工程化工具
│   └── graph.ts langGraph入口
├── test/ 测试用例
├── agentlog.log  /日志
├── graphState.png /graph状态可视化
├── test/ 测试用例
├── .gitignore 
├── README.md
├── package.json
├── tsconfig.json
└── .env 环境变量，模型KEY配置
```

🚀 快速开始
```base
npm install
```