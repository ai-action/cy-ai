/// <reference types="cypress" />

import { options } from './utils'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Set global configuration options for `cy.ai`.
       */
      aiConfig(options: Partial<AiOptions>): Chainable<void>
    }
  }
}

Cypress.Commands.add('aiConfig', command)

function command({
  llm,
  log,
  regenerate,
  timeout,
}: Partial<Cypress.AiOptions>) {
  if (typeof llm?.invoke === 'function') {
    options.llm = llm
  }

  if (typeof log === 'boolean') {
    options.log = log
  }

  if (typeof regenerate === 'boolean') {
    options.regenerate = regenerate
  }

  if (timeout && timeout > 0) {
    options.timeout = timeout
  }
}
