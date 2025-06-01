import { PromptTemplate } from '@langchain/core/prompts'
import { Ollama } from '@langchain/ollama'

const llm = new Ollama({
  model: 'qwen2.5-coder',
  numCtx: 8192,
})

const prompt = PromptTemplate.fromTemplate(`
You are writing an E2E test step with Cypress.

Rules:

1. Return JavaScript Cypress code without "describe" and "it".

Task: {task}
`)

const chain = prompt.pipe(llm)

describe('options', () => {
  it('sets options', () => {
    cy.ai("open https://example.com and see heading 'Example Domain'", {
      llm: chain,
      log: false,
      regenerate: false,
      timeout: 1000 * 60 * 5, // 5 minutes
    })
  })
})
