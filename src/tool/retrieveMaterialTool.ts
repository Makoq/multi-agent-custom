import { DynamicStructuredTool, DynamicTool, JsonGetValueTool, ReadFileTool, Tool } from 'langchain/tools';
import { z } from 'zod';
import { InMemoryFileStore } from 'langchain/stores/file/in_memory';
import { NodeFileStore } from 'langchain/stores/file/node';

export const retrieveMaterialTool = new DynamicTool({
  name: 'retrieveMaterialTool',
  description: '检索物料工具',
  func: async input => {
   
  },
});
