describe('Availability Testing', () => {
  it('Opens the shopping list Application', () => {
    cy.visit('http://localhost:8081')

    cy.contains('Shopping Lists')
  })
})