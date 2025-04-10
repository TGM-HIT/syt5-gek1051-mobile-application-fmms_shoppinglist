/**
 * Author: Felix Dahmen
 * Version: 03.04.2025
 */
describe("Testing Shopping List Item Checked", () => {
    const listName = 'Testliste';
    const itemName = 'Eier';
    const itemQuantity = '6';
    const itemUnit = 'Stück';

    beforeEach(() => {
        cy.visit('/');

        // Liste erstellen
        cy.get('button').contains('add').click();
        cy.get('input[placeholder="e.g. Food"]').type(listName);
        cy.get('button').contains('check').click();

        // Liste öffnen
        cy.contains(listName).parents('.md-card').within(() => {
            cy.get('button').contains('chevron_right').click();
        });
    });

    it("Creates an item successfully", () => {
        // Neues Item mit Menge + Einheit hinzufügen
        cy.get('input[placeholder="Quantity"]').type(itemQuantity);
        cy.get('input[placeholder="Unit"]').type(itemUnit);
        cy.get('input[placeholder="Item name"]').type(itemName);
        cy.get('button').contains('add_shopping_cart').click();

        // Sicherstellen, dass das Item in der Liste auftaucht
        cy.contains(`${itemQuantity} ${itemUnit} ${itemName}`).should('exist');
    });


    it("delete an item", () => {
        cy.get('input[placeholder="Quantity"]').type(itemQuantity);
        cy.get('input[placeholder="Unit"]').type(itemUnit);
        cy.get('input[placeholder="Item name"]').type(itemName);
        cy.get('button').contains('add_shopping_cart').click();

        cy.contains(`${itemQuantity} ${itemUnit} ${itemName}`)
            .parents('.listitem')
            .within(() => {
                cy.get('button').contains('cancel').click();
            });

        cy.contains(`${itemQuantity} ${itemUnit} ${itemName}`).should('not.exist');
    });



    afterEach(() => {
        indexedDB.deleteDatabase('shopping');
        cy.clearLocalStorage();
    });
});

