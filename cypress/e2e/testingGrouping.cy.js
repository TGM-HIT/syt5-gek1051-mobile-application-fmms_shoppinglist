describe("Testing Grouping of Items by Category", () => {
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

        // Add multiple items with different categories
        cy.get('input[placeholder="Quantity"]').type('2');
        cy.get('input[placeholder="Unit"]').type('kg');
        cy.get('input[placeholder="Item name"]').type('Apples');

        // Warte auf ein anderes Element, das sicherstellt, dass die Seite geladen ist
        cy.get('button').contains('add_shopping_cart').should('be.visible');

        // Warte auf das Dropdown und interagiere damit
        cy.get('[data-testid="select-item-category"]').should('exist').click();
        cy.get('[data-testid="option-category-Fruits"]').click();
        cy.get('button').contains('add_shopping_cart').click();

        cy.get('input[placeholder="Quantity"]').type('1');
        cy.get('input[placeholder="Unit"]').type('L');
        cy.get('input[placeholder="Item name"]').type('Milk');
        cy.get('[data-testid="select-item-category"]').should('exist').click();
        cy.get('[data-testid="option-category-Dairy"]').click();
        cy.get('button').contains('add_shopping_cart').click();

        cy.get('input[placeholder="Quantity"]').type('500');
        cy.get('input[placeholder="Unit"]').type('g');
        cy.get('input[placeholder="Item name"]').type('Chicken');
        cy.get('[data-testid="select-item-category"]').should('exist').click();
        cy.get('[data-testid="option-category-Meat"]').click();
        cy.get('button').contains('add_shopping_cart').click();
    });

    it('Groups items correctly by category', () => {
        // Check if items are grouped under the correct category headers
        cy.get('.category-header').contains('Fruits').should('exist');
        cy.get('.category-header').contains('Dairy').should('exist');
        cy.get('.category-header').contains('Meat').should('exist');

        // Verify items under each category
        cy.get('.category-header').contains('Fruits').nextUntil('.category-header').should('contain.text', 'Apples');
        cy.get('.category-header').contains('Dairy').nextUntil('.category-header').should('contain.text', 'Milk');
        cy.get('.category-header').contains('Meat').nextUntil('.category-header').should('contain.text', 'Chicken');
    });

    it('Displays "Uncategorized" for items without a category', () => {
        // Add an item without selecting a category
        cy.get('input[placeholder="Quantity"]').type('3');
        cy.get('input[placeholder="Unit"]').type('pcs');
        cy.get('input[placeholder="Item name"]').type('Bread');
        cy.get('button').contains('add_shopping_cart').click();

        // Check if "Uncategorized" header exists
        cy.get('.category-header').contains('Other').should('exist');

        // Verify the item is under "Uncategorized"
        cy.get('.category-header').contains('Other').nextUntil('.category-header').should('contain.text', 'Bread');
    });

    it('Updates grouping when an item category is changed', () => {
        // Open detail view for "Milk" and change its category to "Beverages"
        cy.get('[data-testid="btn-item-detail-Milk"]').click();
        cy.get('[data-testid="select-item-category"]').click();
        cy.get('[data-testid="option-category-Beverages"]').click();
        cy.get('[data-testid="btn-save-item-detail"]').click();

        // Verify "Milk" is now under "Beverages"
        cy.get('.category-header').contains('Beverages').nextUntil('.category-header').should('contain.text', 'Milk');

        // Check if "Dairy" category still exists
        cy.get('body').then(($body) => {
            if ($body.find('.category-header:contains("Dairy")').length > 0) {
                // If "Dairy" exists, verify "Milk" is no longer under it
                cy.get('.category-header').contains('Dairy').nextUntil('.category-header').should('not.contain.text', 'Milk');
            } else {
                // If "Dairy" does not exist, it was correctly removed
                cy.log('Category "Dairy" was removed as it is empty.');
            }
        });
    });

    it('Handles empty categories gracefully', () => {
        // Delete all items in "Fruits"
        cy.get('.category-header').contains('Fruits').nextUntil('.category-header').within(() => {
            cy.get('button').contains('cancel').click();
        });

        // Verify "Fruits" category header is removed
        cy.get('.category-header').contains('Fruits').should('not.exist');
    });

    afterEach(() => {
        cy.clearLocalStorage();
    });
});
