describe('Availability Testing', () => {
  it('Opens the shopping list Application', () => {
    cy.visit('/')

    cy.contains('Shopping Lists')
  })
})