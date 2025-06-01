import { PromptTemplate } from '@langchain/core/prompts';
import { Ollama } from '@langchain/ollama';

import { template } from './template';

const llm = new Ollama({
  model: 'qwen2.5-coder',
  numCtx: 16384,
});

export const prompt = PromptTemplate.fromTemplate(template.trim());

export const chain = prompt.pipe(llm);
