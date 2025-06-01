describe('ai', () => {
  it('submits form', () => {
    cy.ai('go to example.cypress.io and see "Kitchen Sink"')
    cy.ai('click on link "submit"')
    cy.ai("find label 'Coupon Code' and type 'HALFOFF'")
    cy.ai("click button 'Submit'")
    cy.ai("assert 'Your form has been submitted!'")
  })
})
