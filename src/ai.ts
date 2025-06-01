/// <reference types="cypress" />

import { sanitize } from 'dompurify';

import { generated, llm, minutes, regex } from './utils';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Run Cypress with AI prompt.
       */
      ai(task: string, options?: Partial<Options>): Chainable<void>;
    }

    interface Options extends Loggable, Timeoutable {}
  }
}

const name = 'ai';

Cypress.Commands.add(name, command);

function command(task: string, { log = true, timeout = minutes(2) } = {}) {
  if (log) {
    Cypress.log({ displayName: name, message: task });
  }

  generated.read().then((content) => {
    const code = generated.code(content, task);

    if (code) {
      return eval(code);
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
