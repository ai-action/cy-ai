import { resolve } from 'path'

import { noop } from './noop'

const options = { log: false }

/**
 * Read generated file.
 *
 * @returns - Chainable JSON content.
 */
export const read = () => cy.readFile(generated.path, options).should(noop)

const generated = {
  /**
   * Generated test file path.
   *
   * E.g., "/Users/remarkablemark/app/cypress/e2e/__generated__/spec.cy.js.json").
   *
   * @returns - Generated file path.
   */
  get path() {
    return resolve(
      Cypress.spec.absolute,
      `../__generated__/${Cypress.spec.name}.json`,
    )
  },

  /**
   * Test title that combines `describe` and `it`.
   *
   * @returns - Test key.
   */
  get title() {
    return Cypress.currentTest.titlePath.join(' ')
  },
}

type Content = Record<string, Record<string, string>>

/**
 * Get generated code.
 *
 * @param content - JSON data.
 * @param task - AI task.
 * @returns - Cypress code.
 */
export const code = (content: Content, task: string) =>
  content?.[generated.title]?.[task] ?? ''

/**
 * Save generated code.
 *
 * @param task - AI task.
 * @param code - Cypress code.
 */
export function save(task: string, code: string) {
  read().then((content: Content) => {
    const { title } = generated

    content = content || {}
    content[title] = content[title] || {}
    content[title][task] = code

    const json = JSON.stringify(content, null, 2)

    cy.writeFile(generated.path, json, options)
  })
}
