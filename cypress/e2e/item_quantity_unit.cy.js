describe('Shopping List Item Quantity & Unit Functionality', () => {

    beforeEach(() => {
        cy.visit('/');

        // create a new list for the test
        cy.get('button').contains('add').click();
        cy.get('input[placeholder="e.g. Food"]').type('Testliste');
        cy.get('button').contains('check').click();

        // open the created list
        cy.get('.md-card').first().within(() => {
            cy.get('button').contains('chevron_right').click();
        });
    });

    it('should allow adding an item with quantity and unit', () => {
        cy.get('.input-small input').eq(0).type('3'); // quantity
        cy.get('.input-small input').eq(1).type('kg'); // unit
        cy.get('.input-wide input').type('Kartoffeln');
        cy.get('button').contains('add_shopping_cart').click();

        // check if the input is displayed properly
        cy.get('.md-list-text-container').should('contain', '3 kg Kartoffeln');
    });

    it('should show quantity as 1 and unit as empty if not provided', () => {
        // leave quantity and unit empty, just item name
        cy.get('.input-small input').eq(0).clear();
        cy.get('.input-small input').eq(1).clear();
        cy.get('.input-wide input').type('Bananen');
        cy.get('button').contains('add_shopping_cart').click();

        // checking results
        cy.get('.md-list-text-container').should('contain', '1  Bananen');
    });

    it('should allow adding an item with only quantity and no unit', () => {
        cy.get('.input-small input').eq(0).type('5'); // quantity
        cy.get('.input-small input').eq(1).clear();   // unit leer
        cy.get('.input-wide input').type('Eier');
        cy.get('button').contains('add_shopping_cart').click();

        cy.get('.md-list-text-container').should('contain', '5  Eier');
    });

    it('should allow adding an item with only unit and no quantity → default to 1', () => {
        cy.get('.input-small input').eq(0).clear();    // quantity leer → default = 1
        cy.get('.input-small input').eq(1).type('Stück'); // unit gesetzt
        cy.get('.input-wide input').type('Apfel');
        cy.get('button').contains('add_shopping_cart').click();

        cy.get('.md-list-text-container').should('contain', '1 Stück Apfel');
    });

});
