/**
 * Author: Manuel Fellner
 * Version: 29.03.2025
 */
describe('Shopping List Item Quantity & Unit Functionality', () => {

    beforeEach(() => {
        // Starte die App
        cy.visit('/');

        // Erstelle neue Liste für isolierten Test
        cy.get('button').contains('add').click();
        cy.get('input[placeholder="e.g. Food"]').type('Testliste');
        cy.get('button').contains('check').click();

        // Öffne die Testliste
        cy.get('.md-card').first().within(() => {
            cy.get('button').contains('chevron_right').click();
        });
    });

    it('should allow adding an item with quantity and unit', () => {
        cy.get('.input-small input').eq(0).type('3'); // quantity
        cy.get('.input-small input').eq(1).type('kg'); // unit
        cy.get('.input-wide input').type('Kartoffeln');
        cy.get('button').contains('add_shopping_cart').click();

        // Überprüfung
        cy.get('.md-list-text-container').should('contain', '3 kg Kartoffeln');
    });

    it('should show quantity as 1 and unit as empty if not provided', () => {
        // Leere quantity und unit, nur Titel angeben
        cy.get('.input-small input').eq(0).clear();
        cy.get('.input-small input').eq(1).clear();
        cy.get('.input-wide input').type('Bananen');
        cy.get('button').contains('add_shopping_cart').click();

        // Erwartet: "1  Bananen"
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
