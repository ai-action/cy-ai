/// <reference types="cypress" />

import type { AIMessage } from '@langchain/core/messages'
import type { Runnable } from '@langchain/core/runnables'
import { sanitize } from 'dompurify'

import { codeblock, generated, options } from './utils'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Run Cypress with AI prompt.
       */
      ai(task: string, options?: Partial<AiOptions>): Chainable<void>
    }

    interface AiOptions extends Loggable, Timeoutable {
      /**
       * LangChain Runnable to invoke.
       *
       * @defaultValue Prompt template using Ollama model `qwen2.5-coder`
       */
      llm: Runnable<Record<string, string>, string | AIMessage>

      /**
       * Whether to regenerate the Cypress step with AI.
       *
       * @defaultValue false
       */
      regenerate: boolean
    }
  }
}

const name = 'ai'

Cypress.Commands.add(name, command)

function command(
  task: string,
  {
    llm = options.llm,
    log = options.log,
    regenerate = options.regenerate,
    timeout = options.timeout,
  }: Partial<Cypress.AiOptions> = {},
) {
  if (log) {
    Cypress.log({ displayName: name, message: task })
  }

  generated.read(task).then((content) => {
    if (!regenerate) {
      const code = generated.code(content)

      if (code) {
        eval(code)
        return
      }
    }

    cy.document({ log: false, timeout }).then(async (doc) => {
      const response = await llm.invoke({
        task,
        html: sanitize(doc.body.innerHTML),
      })

      if (log) {
        // eslint-disable-next-line no-console
        console.table({
          Task: task,
          Response: response,
        })
      }

      const code = codeblock(response)

      if (code) {
        eval(code)
        generated.save(code)
        return
      }

      throw new Error(typeof response === 'string' ? response : response.text)
    })
  })
}
