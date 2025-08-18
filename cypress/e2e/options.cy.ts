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

before(() => {
  cy.aiConfig({ llm: chain })
})

describe('options', () => {
  it('sets options', () => {
    cy.visit('https://example.cypress.io')
    cy.ai("see heading 'Kitchen Sink'")
    cy.ai("click link 'Cypress API'", {
      llm: chain,
      log: false,
      regenerate: false,
      timeout: 1000 * 60 * 5, // 5 minutes
    })
  })
})
