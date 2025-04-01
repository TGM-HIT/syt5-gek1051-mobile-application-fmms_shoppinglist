/**
 * Author: Manuel Fellner
 * Version: 01.04.2025
 */
describe("Item can be checked", () => {
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

    it("create an item and mark it as 'checked'", () => {
        // Neues Item mit Menge + Einheit hinzufügen
        cy.get('input[placeholder="Quantity"]').type(itemQuantity);
        cy.get('input[placeholder="Unit"]').type(itemUnit);
        cy.get('input[placeholder="Item name"]').type(itemName);
        cy.get('button').contains('add_shopping_cart').click();

        // Sicherstellen, dass das Item auftaucht
        cy.contains(`${itemQuantity} ${itemUnit} ${itemName}`).should('exist');

        // check checkbox
        cy.contains(`${itemQuantity} ${itemUnit} ${itemName}`)
            .parents('.listitem')
            .within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
                cy.get('input[type="checkbox"]').should('be.checked');
            });
    });

    afterEach(() => {
        // Browser-Storage (IndexedDB / LocalStorage) cleanup
        indexedDB.deleteDatabase('shopping');
        cy.clearLocalStorage();
    });
});
