describe('options', () => {
  it('sets options', () => {
    cy.ai("open https://example.com and see heading 'Example Domain'", {
      log: false,
      timeout: 1000 * 60 * 5, // 5 minutes
    });
  });
});
