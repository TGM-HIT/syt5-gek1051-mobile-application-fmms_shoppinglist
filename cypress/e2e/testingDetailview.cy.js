describe("Testing Item Detail View functionality", () => {
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

        // Add an item with quantity/unit
        cy.get('input[placeholder="Quantity"]').type('6');
        cy.get('input[placeholder="Unit"]').type('Stück');
        cy.get('input[placeholder="Item name"]').type('Eier');
        cy.get('button').contains('add_shopping_cart').click();
    });

    it('Opens the detail view of an item', () => {
        cy.get('[data-testid="btn-item-detail-Eier"]').click();

        cy.get('[data-testid="item-detail-card"]').should('be.visible');
        cy.get('[data-testid="input-item-title"]').should('have.value', 'Eier');

        // optional: Menge und Einheit kontrollieren
        cy.get('[data-testid="item-detail-card"]').within(() => {
            cy.get('input').eq(1).should('have.value', '6');
            cy.get('input').eq(2).should('have.value', 'Stück');
        });
    });

    it('Cancels changes in the detail view', () => {
        cy.get('[data-testid="btn-item-detail-Eier"]').click();

        // Update title to "Milch"
        const updatedTitle = 'Milch';
        cy.get('[data-testid="input-item-title"]').clear().type(updatedTitle);

        // Cancel changes
        cy.get('[data-testid="btn-cancel-item-detail"]').click();

        // Original Item sollte noch da sein (mit Menge + Einheit)
        cy.get('.md-list-text-container').should('contain.text', '6 Stück Eier');
        cy.get('.md-list-text-container').should('not.contain.text', updatedTitle);
    });

    it('Displays the category dropdown in the detail view', () => {
        cy.get('[data-testid="btn-item-detail-Eier"]').click();

        // Check if the category dropdown is visible
        cy.get('[data-testid="select-item-category"]').should('be.visible');
    });

    it('Shows the correct default category in the detail view', () => {
        cy.get('[data-testid="btn-item-detail-Eier"]').click();

        // Check if the default category is "Other"
        cy.get('[data-testid="select-item-category"] .md-select-value').should('contain.text', 'Other');
    });

    it('Allows changing the category in the detail view', () => {
        cy.get('[data-testid="btn-item-detail-Eier"]').click();

        // Change the category to "Dairy"
        cy.get('[data-testid="select-item-category"]').click();
        cy.get('[data-testid="option-category-Dairy"]').click();

        // Save the changes
        cy.get('[data-testid="btn-save-item-detail"]').click();

        // Verify the category is updated
        cy.get('[data-testid="btn-item-detail-Eier"]').click();
        cy.get('[data-testid="select-item-category"] .md-select-value').should('contain.text', 'Dairy');
    });

    it('Retains the updated category after navigating back to the list', () => {
        cy.get('[data-testid="btn-item-detail-Eier"]').click();

        // Change the category to "Fruits"
        cy.get('[data-testid="select-item-category"]').click();
        cy.get('[data-testid="option-category-Fruits"]').click();

        // Save the changes
        cy.get('[data-testid="btn-save-item-detail"]').click();

        // Navigate back to the detail view and verify the category
        cy.get('[data-testid="btn-item-detail-Eier"]').click();
        cy.get('[data-testid="select-item-category"] .md-select-value').should('contain.text', 'Fruits');
    });

    afterEach(() => {
        cy.clearLocalStorage();
    });
});
