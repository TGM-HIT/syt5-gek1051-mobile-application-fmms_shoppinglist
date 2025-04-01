describe("Testing Item Checking functionality", () => {
    beforeEach(() => {
        cy.visit('/');

        // Create a new list for the test
        cy.get('button').contains('add').click();
        cy.get('input[placeholder="e.g. Food"]').type('Testliste');
        cy.get('button').contains('check').click();

        // Open the created list
        cy.get('.md-card').first().within(() => {
            cy.get('button').contains('chevron_right').click();
        });
    });

    it('Triggers the checkbox on a created item', () => {
        // Add an item to the list
        cy.get('[data-testid="input-new-item"]').type('Eier');
        cy.get('[data-testid="btn-add-item"]').click()

        // Assert that the checkbox is checked
        cy.get('.md-checkbox').click()
        cy.contains('Eier').parent().parent().find('input[type="checkbox"]').should('be.checked');
    });
    afterEach(() => {
        cy.clearLocalStorage() // clear all local storage
    })
});