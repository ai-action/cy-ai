> [!NOTE]
> This package is under development so expect **breaking changes** in future releases.

# cy-ai

[![NPM](https://nodei.co/npm/cy-ai.png)](https://nodei.co/npm/cy-ai/)

[![NPM version](https://img.shields.io/npm/v/cy-ai.svg)](https://www.npmjs.com/package/cy-ai)
[![build](https://github.com/ai-action/cy-ai/actions/workflows/build.yml/badge.svg)](https://github.com/ai-action/cy-ai/actions/workflows/build.yml)

🧪 Cypress AI command that writes E2E tests using an LLM (Large Language Model):

```
cy.ai(string)
```

## Prerequisites

- [Cypress](https://docs.cypress.io/app/get-started/install-cypress)
- [Ollama](https://ollama.com/download)

## Install

[NPM](https://www.npmjs.com/package/cy-ai):

```sh
npm install cy-ai
```

[Yarn](https://yarnpkg.com/package/cy-ai):

```sh
yarn add cy-ai
```

## Usage

Import command using ES2015 syntax:

```ts
// cypress/support/commands.ts
import 'cy-ai';
```

Or use CommonJS syntax:

```js
// cypress/support/commands.js
require('cy-ai');
```

Update `cypress.config.js` so LLM request is not blocked by CORS:

```js
// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  // ...
});
```

Run Ollama:

```sh
ollama serve
```

Download [LLM](https://ollama.com/library/qwen2.5-coder):

```sh
ollama pull qwen2.5-coder
```

Write test:

```js
it('visits example.com', () => {
  cy.ai('go to https://example.com and see heading "Example Domain"');
});
```

## How It Works

1. A prompt is created using your task, the current HTML body, and a template.
2. The prompt is sent to the LLM server.
3. The LLM server responds with Cypress code that gets cleaned and run.
4. If the steps pass, the code is saved to `cypress/e2e/**/__generated__/*.json`.
5. If the steps fail, an error is thrown and you can inspect the LLM response in the browser **Console**.

The command will run the generated Cypress code if it exists. To regenerate a step, delete the task in `cypress/e2e/**/__generated__/*.json`.

## Release

Release is automated with [Release Please](https://github.com/googleapis/release-please).

## License

[MIT](https://github.com/ai-action/cy-ai/blob/master/LICENSE)
