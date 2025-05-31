import { defineConfig } from 'cypress';

export default defineConfig({
  // don't block CORS for LLM request
  chromeWebSecurity: false,

  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
