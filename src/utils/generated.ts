import { resolve } from 'path'

const options = { log: false }

class Generated {
  private _counters = new Map<string, number>()
  private _task = ''
  private _pathTitle = ''

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
  }

  /**
   * Test title that combines `describe` and `it`.
   *
   * @returns - Test key.
   */
  get title() {
    return Cypress.currentTest.titlePath.join(' ')
  }

  /**
   * Get task.
   *
   * @returns - Task with counter.
   */
  get task() {
    return `${this._task} ${this.counter}`
  }

  /**
   * Get task counter.
   *
   * @returns - Task counter.
   */
  get counter() {
    return this._counters.get(this._task) || 0
  }

  /**
   * Set task.
   *
   * @param task - Task.
   */
  set task(task: string) {
    const pathTitle = [this.path, this.title].join(':')

    if (pathTitle !== this._pathTitle) {
      this._counters.clear()
      this._pathTitle = pathTitle
    }

    this._task = task
    this._counters.set(task, this.counter + 1)
  }
}

const generated = new Generated()

/**
 * Read generated file.
 *
 * @param task - Task.
 * @returns - Chainable JSON content.
 */
export function read(task?: string) {
  return cy.readFile(generated.path, options).should(() => {
    if (task) {
      generated.task = task
    }
  })
}

type Content = Record<string, Record<string, string>>

/**
 * Get generated code.
 *
 * @param content - JSON data.
 * @returns - Cypress code.
 */
export const code = (content: Content) =>
  content?.[generated.title]?.[generated.task] ?? ''

/**
 * Save generated code.
 *
 * @param code - Cypress code.
 */
export function save(code: string) {
  read().then((content: Content) => {
    const { task, title } = generated

    if (!content) {
      content = {}
    }

    if (!content[title]) {
      content[title] = {}
    }

    content[title][task] = code
    const json = JSON.stringify(content, null, 2)
    cy.writeFile(generated.path, json, options)
  })
}
