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

    it("uncheck a checked item", () => {
        cy.get('input[placeholder="Quantity"]').type(itemQuantity);
        cy.get('input[placeholder="Unit"]').type(itemUnit);
        cy.get('input[placeholder="Item name"]').type(itemName);
        cy.get('button').contains('add_shopping_cart').click();

        cy.contains(`${itemQuantity} ${itemUnit} ${itemName}`)
            .parents('.listitem')
            .within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
                cy.get('input[type="checkbox"]').should('be.checked');

                cy.get('input[type="checkbox"]').uncheck({ force: true });
                cy.get('input[type="checkbox"]').should('not.be.checked');
            });
    });

    it("checked items persist after reload", () => {
        cy.get('input[placeholder="Quantity"]').type(itemQuantity);
        cy.get('input[placeholder="Unit"]').type(itemUnit);
        cy.get('input[placeholder="Item name"]').type(itemName);
        cy.get('button').contains('add_shopping_cart').click();

        cy.contains(`${itemQuantity} ${itemUnit} ${itemName}`)
            .parents('.listitem')
            .within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
                cy.get('input[type="checkbox"]').should('be.checked');
            });

        cy.reload();

        cy.contains(listName).parents('.md-card').within(() => {
            cy.get('button').contains('chevron_right').click();
        });

        cy.contains(`${itemQuantity} ${itemUnit} ${itemName}`)
            .parents('.listitem')
            .within(() => {
                cy.get('input[type="checkbox"]').should('be.checked');
            });
    });

    it("add multiple items and check all", () => {
        const items = [
            { name: "Brot", quantity: "1", unit: "Laib" },
            { name: "Milch", quantity: "2", unit: "Liter" },
            { name: "Butter", quantity: "1", unit: "Packung" }
        ];

        items.forEach((item) => {
            cy.get('input[placeholder="Quantity"]').type(item.quantity);
            cy.get('input[placeholder="Unit"]').type(item.unit);
            cy.get('input[placeholder="Item name"]').type(item.name);
            cy.get('button').contains('add_shopping_cart').click();
        });

        items.forEach((item) => {
            cy.contains(`${item.quantity} ${item.unit} ${item.name}`)
                .parents('.listitem')
                .within(() => {
                    cy.get('input[type="checkbox"]').check({ force: true });
                    cy.get('input[type="checkbox"]').should('be.checked');
                });
        });
    });

    afterEach(() => {
        indexedDB.deleteDatabase('shopping');
        cy.clearLocalStorage() // clear all local storage
    })
});
