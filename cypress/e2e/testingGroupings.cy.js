describe('Shopping List Grouping Tests', () => {
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

    it('should group items by category', () => {
        // Add items with different categories
        const items = [
            { title: 'Apple', category: 'Fruits' },
            { title: 'Carrot', category: 'Vegetables' },
            { title: 'Milk', category: 'Dairy' },
        ];

        items.forEach(item => {
            cy.get('[data-testid="input-new-item"]').type(item.title);
            cy.get('.category-select').click();
            cy.contains('.md-option', item.category).click();
            cy.get('[data-testid="btn-add-item"]').click();
        });

        // Wait for the DOM to update
        cy.wait(500);

        // Verify items are grouped by category
        items.forEach(item => {
            cy.contains('.md-list .md-subheader', item.category).should('exist'); // Adjusted selector
            cy.contains('.listitem span', item.title).should('exist');
        });
    });
});
