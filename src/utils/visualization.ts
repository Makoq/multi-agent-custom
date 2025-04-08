import { writeFileSync } from "node:fs";

export const visual = async function (graph: any) {
  const representation = graph.getGraph();
  const image = await representation.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const filePath = "./graphState.png";
  writeFileSync(filePath, buffer);
};
