import { Ollama } from '@langchain/ollama'

import { prompt } from '../../src'
import { options } from '../../src/utils'
import { chain as defaultChain } from '../../src/utils/llm'

const llm = new Ollama({
  model: 'codellama',
})

const chain = prompt.pipe(llm)

const TWO_MINUTES = 1000 * 60 * 2

describe('aiConfig', () => {
  it('overrides options', () => {
    expect(options.llm).to.equal(defaultChain)
    expect(options.log).to.equal(true)
    expect(options.regenerate).to.equal(false)
    expect(options.timeout).to.equal(TWO_MINUTES)

    cy.aiConfig({
      llm: chain,
      log: false,
      regenerate: true,
      timeout: TWO_MINUTES / 2,
    }).should(() => {
      expect(options.llm).to.equal(chain)
      expect(options.log).to.equal(false)
      expect(options.regenerate).to.equal(true)
      expect(options.timeout).to.equal(TWO_MINUTES / 2)
    })
  })
})
