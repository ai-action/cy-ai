import { resolve } from 'path';

import { noop } from './noop';

const options = { log: false };

/**
 * Get generated file path.
 *
 * E.g., "/Users/remarkablemark/app/cypress/e2e/__generated__/spec.cy.js.json").
 *
 * @returns - Generated file path.
 */
const filePath = () =>
  resolve(Cypress.spec.absolute, `../__generated__/${Cypress.spec.name}.json`);

/**
 * Read generated file.
 *
 * @returns - Chainable JSON content.
 */
export const read = () => cy.readFile(filePath(), options).should(noop);

const test = {
  /**
   * Generate key using test title (`describe` and `it`).
   *
   * @returns - Test key.
   */
  get key() {
    return Cypress.currentTest.titlePath.join(' ');
  },
};

type Content = Record<string, Record<string, string>>;

/**
 * Get generated code.
 *
 * @param content - JSON data.
 * @param task - AI task.
 * @returns - Cypress code.
 */
export const code = (content: Content, task: string) =>
  content?.[test.key]?.[task] ?? '';

/**
 * Save generated code.
 *
 * @param task - AI task.
 * @param code - Cypress code.
 */
export function save(task: string, code: string) {
  read().then((content: Content) => {
    const { key } = test;

    content = content || {};
    content[key] = content[key] || {};
    content[key][task] = code;

    const json = JSON.stringify(content, null, 2);

    cy.writeFile(filePath(), json, options);
  });
}
