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
   * Get task counter.
   *
   * @returns - Task counter.
   */
  get counter() {
    return this._counters.get(this._task) ?? 0
  }

  /**
   * Get task.
   *
   * @returns - Task with counter.
   */
  get task() {
    return `${this._task} ${String(this.counter)}`
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

type Content = Partial<Record<string, Partial<Record<string, string>>>>

/**
 * Read generated file.
 *
 * @param task - Task.
 * @returns - Chainable JSON content.
 */
export function read(task?: string) {
  return cy.readFile<Content | null>(generated.path, options).should(() => {
    if (task) {
      generated.task = task
    }
  })
}

/**
 * Get generated code.
 *
 * @param content - JSON data.
 * @returns - Cypress code.
 */
export const code = (content: Content | null) =>
  content?.[generated.title]?.[generated.task] ?? ''

/**
 * Save generated code.
 *
 * @param code - Cypress code.
 */
export function save(code: string) {
  read().then((content) => {
    const { task, title } = generated

    content ??= {}
    content[title] ??= {}
    content[title][task] = code
    const json = JSON.stringify(content, null, 2)
    cy.writeFile(generated.path, json, options)
  })
}
