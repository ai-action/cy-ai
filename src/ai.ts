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
      ai(task: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('ai', (task) => {
  Cypress.log({ displayName: 'ai', message: task });

  generated.read().then((content) => {
    const code = generated.code(content, task);

    if (code) {
      return eval(code);
    }

    cy.document({ log: false }).then({ timeout: minutes(2) }, async (doc) => {
      const response = await llm.invoke({
        task,
        html: sanitize(doc.body.innerHTML),
      });

      // eslint-disable-next-line no-console
      console.table({
        Task: task,
        Response: response,
      });

      const code = response.match(regex.codeblock)?.[2]?.trim();

      if (code) {
        eval(code);
        return generated.save(task, code);
      }

      throw new Error(response);
    });
  });
});
