describe('example.com', () => {
  it('sees heading', () => {
    cy.ai("open https://example.com and see heading 'Example Domain'");
  });
});
