import winston from "winston";

// 配置 winston 日志记录器
export const logger = winston.createLogger({
  level: "silly",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(), // JSON 格式日志
    winston.format.prettyPrint() // 美化 JSON
    // winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`)
  ),
  transports: [
    // 将日志写入本地文件
    new winston.transports.File({ filename: "agent.log" }),
    // 同时在控制台输出日志
    new winston.transports.Console({ level: "silly" }),
  ],
});
