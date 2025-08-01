# Cypress AI

[![NPM](https://nodei.co/npm/cy-ai.png)](https://nodei.co/npm/cy-ai/)

[![NPM version](https://img.shields.io/npm/v/cy-ai.svg)](https://www.npmjs.com/package/cy-ai)
[![build](https://github.com/ai-action/cy-ai/actions/workflows/build.yml/badge.svg)](https://github.com/ai-action/cy-ai/actions/workflows/build.yml)
[![test](https://github.com/ai-action/cy-ai/actions/workflows/test.yml/badge.svg)](https://github.com/ai-action/cy-ai/actions/workflows/test.yml)

🧪 Cypress AI command that generates E2E tests with LLM (Large Language Model):

```js
cy.ai(string)
```

Read the [wiki](https://github.com/ai-action/cy-ai/wiki).

## Prerequisites

- [Cypress](https://docs.cypress.io/app/get-started/install-cypress)
- [Ollama](https://ollama.com/download)

## Install

[NPM](https://www.npmjs.com/package/cy-ai):

```sh
npm install cy-ai --save-dev
```

[Yarn](https://yarnpkg.com/package/cy-ai):

```sh
yarn add cy-ai --dev
```

## Usage

If you're using TypeScript, import the command using ES2015 syntax:

```sh
echo "import 'cy-ai'" >> cypress/support/commands.ts
```

Or if you're using JavaScript, use CommonJS require:

```sh
echo "require('cy-ai')" >> cypress/support/commands.js
```

Start the Ollama server:

```sh
ollama serve
```

Download the [LLM](https://ollama.com/library/qwen2.5-coder):

```sh
ollama pull qwen2.5-coder
```

Write a test:

```js
// cypress/e2e/example.cy.js
it('visits example.com', () => {
  cy.visit('/')
  cy.ai('see heading "Example Domain"')
})
```

> [!TIP]
> If you're running Chrome, disable `chromeWebSecurity` so the LLM requests aren't blocked by CORS:
>
> ```js
> // cypress.config.js
> import { defineConfig } from 'cypress'
>
> export default defineConfig({
>   chromeWebSecurity: false,
> })
> ```

## cy.ai

Generate Cypress tests with AI:

```
cy.ai(string[, options])
```

### llm

LangChain [Runnable](https://js.langchain.com/docs/concepts/runnables/) to invoke. Defaults to a prompt template using the Ollama model `qwen2.5-coder`.

Use a different large language model:

```ts
import { Ollama } from '@langchain/ollama'
import { prompt } from 'cy-ai'

const llm = new Ollama({
  model: 'codellama',
  numCtx: 16384,
})

const chain = prompt.pipe(llm)

cy.ai('prompt', { llm: chain })
```

Or customize the template:

```ts
import { PromptTemplate } from '@langchain/core/prompts'
import { Ollama } from '@langchain/ollama'

const llm = new Ollama({
  model: 'codellama',
  numCtx: 16384,
})

const prompt = PromptTemplate.fromTemplate(`
You are writing an E2E test step with Cypress.

Rules:
1. Return JavaScript Cypress code without "describe" and "it".

Task: {task}

HTML:
\`\`\`html
{html}
\`\`\`
`)

const chain = prompt.pipe(llm)

cy.ai('prompt', { llm: chain })
```

> [!IMPORTANT]
> Don't forget to pull the Ollama model:
>
> ```sh
> ollama pull codellama
> ```

### log

Whether to display the command logs. Defaults to `true`:

```js
cy.ai('prompt', { log: true })
```

Hide Cypress and console logs:

```js
cy.ai('prompt', { log: false })
```

### regenerate

Whether to regenerate the Cypress step with AI. Defaults to `false`:

```js
cy.ai('prompt', { regenerate: false })
```

Regenerate the Cypress step with AI:

```js
cy.ai('prompt', { regenerate: true })
```

### timeout

Time to wait in milliseconds. Defaults to 2 minutes:

```js
cy.ai('prompt', { timeout: 120000 })
```

Set timeout to 5 minutes:

```js
cy.ai('prompt', { timeout: 1000 * 60 * 5 })
```

## cy.aiConfig

Configure global options for [cy.ai](#cyai):

```
cy.aiConfig(options)
```

### options

Override default options:

```js
cy.aiConfig({
  llm: chain,
  log: false,
  regenerate: true,
  timeout: 1000 * 60 * 3, // 3 minutes
})
```

Set timeout to 5 minutes:

```js
cy.aiConfig({
  timeout: 1000 * 60 * 5,
})
```

See how to use [Anthropic](https://github.com/ai-action/cy-ai/wiki/Anthropic).

## Examples

- [cypress-ai-demo](https://github.com/ai-action/cypress-ai-demo)

## License

[MIT](https://github.com/ai-action/cy-ai/blob/master/LICENSE)
