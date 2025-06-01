/// <reference types="cypress" />

import type { Runnable } from '@langchain/core/runnables';
import { sanitize } from 'dompurify';

import { generated, options, regex } from './utils';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Run Cypress with AI prompt.
       */
      ai(task: string, options?: Partial<AiOptions>): Chainable<void>;
    }

    interface AiOptions extends Loggable, Timeoutable {
      /**
       * LangChain Runnable to invoke.
       *
       * @defaultValue Prompt template using Ollama model `qwen2.5-coder`
       */
      llm: Runnable;

      /**
       * Whether to regenerate the Cypress step with AI.
       *
       * @defaultValue false
       */
      regenerate: boolean;
    }
  }
}

const name = 'ai';

Cypress.Commands.add(name, command);

function command(
  task: string,
  {
    llm = options.llm,
    log = options.log,
    regenerate = options.regenerate,
    timeout = options.timeout,
  } = {},
) {
  if (log) {
    Cypress.log({ displayName: name, message: task });
  }

  generated.read().then((content) => {
    if (!regenerate) {
      const code = generated.code(content, task);

      if (code) {
        return eval(code);
      }
    }

    cy.document({ log: false }).then({ timeout }, async (doc) => {
      const response = await llm.invoke({
        task,
        html: sanitize(doc.body.innerHTML),
      });

      if (log) {
        // eslint-disable-next-line no-console
        console.table({
          Task: task,
          Response: response,
        });
      }

      const code = response.match(regex.codeblock)?.[2]?.trim();

      if (code) {
        eval(code);
        return generated.save(task, code);
      }

      throw new Error(response);
    });
  });
}
