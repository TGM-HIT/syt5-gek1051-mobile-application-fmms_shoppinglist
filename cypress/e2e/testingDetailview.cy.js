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

        // Add an item to the list
        cy.get('[data-testid="input-new-item"]').type('Eier');
        cy.get('[data-testid="btn-add-item"]').click();
    });

    it('Opens the detail view of an item', () => {
        // Open the detail view
        cy.get('[data-testid="btn-item-detail-Eier"]').click();

        // Assert that the detail view is displayed
        cy.get('[data-testid="item-detail-card"]').should('be.visible');
        cy.get('[data-testid="input-item-title"]').should('have.value', 'Eier');
    });

    it('Cancels changes in the detail view', () => {
        // Open the detail view
        cy.get('[data-testid="btn-item-detail-Eier"]').click();

        // Attempt to update the item title
        cy.get('[data-testid="input-item-title"]').clear().type('Milch');
        cy.get('[data-testid="btn-cancel-item-detail"]').click();

        // Assert that the original title is still displayed in the list
        cy.contains('Eier').should('exist');
        cy.contains('Milch').should('not.exist');
    });

    it('should allow changing the category of an item in the detail view', () => {
        // Add a new item
        const itemTitle = 'Cheese';
        const initialCategory = 'Dairy';
        const newCategory = 'Other';

        cy.get('[data-testid="input-new-item"]').type(itemTitle);
        cy.get('.category-select').click();
        cy.contains('.md-option', initialCategory).click();
        cy.get('[data-testid="btn-add-item"]').click();

        // Wait for the DOM to update
        cy.wait(500);

        // Open item detail view
        cy.contains('.listitem', itemTitle)
          .find('[data-testid^="btn-item-detail"]') // Adjusted selector to ensure it matches the correct button
          .click();

        // Change category
        cy.get('[data-testid="select-item-category"]').click();
        cy.contains('.md-option', newCategory).click();

        // Save changes
        cy.get('[data-testid="btn-save-item-detail"]').click();

        // Verify category change
        cy.contains('.md-list .md-subheader', newCategory).should('exist');
        cy.contains('.listitem span', itemTitle).should('exist');
    });

    afterEach(() => {
        cy.clearLocalStorage(); // Clear all local storage
    });
});