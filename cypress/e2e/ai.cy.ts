describe('ai', () => {
  it('submits form', () => {
    cy.visit('https://example.cypress.io')
    cy.ai('see "Kitchen Sink"')
    cy.ai('click on last submit')
    cy.ai("find label 'Coupon Code' and type 'HALFOFF'")
    cy.ai('click on last submit')
    cy.ai("assert 'Your form has been submitted!'")
  })
})
