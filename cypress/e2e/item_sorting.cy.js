describe("Testing Shopping List Item Sorting", () => {
    const listName = 'Testliste';
    const items = [
        { name: "Brot", quantity: "1", unit: "Laib", checked: false },
        { name: "Milch", quantity: "2", unit: "Liter", checked: true },
        { name: "Eier", quantity: "6", unit: "Stück", checked: false },
        { name: "Apfel", quantity: "3", unit: "Stück", checked: true }
    ];

    beforeEach(() => {
        cy.visit('/');

        cy.reload();

        // Create a new list
        cy.get('button').contains('add').click();
        cy.get('input[placeholder="e.g. Food"]').type(listName);

        cy.get('[data-testid="button-save-new-list"]').click();

        // Open the list
        cy.contains(listName).parents('.md-card').within(() => {
            cy.get('button').contains('chevron_right').click();
        });

        // Add items in a random order
        [items[2], items[0], items[3], items[1]].forEach((item) => {
            cy.get('input[placeholder="Quantity"]').type(item.quantity);
            cy.get('input[placeholder="Unit"]').type(item.unit);
            cy.get('input[placeholder="Item name"]').type(item.name);
            cy.get('button').contains('add_shopping_cart').click();
        });

        // Mark some items as checked
        items.forEach((item) => {
            if (item.checked) {
                cy.contains(`${item.quantity} ${item.unit} ${item.name}`)
                    .parents('.listitem')
                    .within(() => {
                        cy.get('input[type="checkbox"]').check({ force: true });
                    });
            }
        });
    });

    it("ensures unchecked items appear first, followed by checked items, both sorted alphabetically", () => {
        cy.get('.listitem').then((listItems) => {
            let sortedUnchecked = items.filter(i => !i.checked).map(i => i.name).sort();
            let sortedChecked = items.filter(i => i.checked).map(i => i.name).sort();
            let expectedOrder = [...sortedUnchecked, ...sortedChecked];

            cy.wrap(listItems).each((item, index) => {
                cy.wrap(item).should('contain.text', expectedOrder[index]);
            });
        });
    });

    it("ensures newly added unchecked items are correctly sorted", () => {
        const newItem = { name: "Karotten", quantity: "5", unit: "Stück", checked: false };

        // Add new item
        cy.get('input[placeholder="Quantity"]').type(newItem.quantity);
        cy.get('input[placeholder="Unit"]').type(newItem.unit);
        cy.get('input[placeholder="Item name"]').type(newItem.name);
        cy.get('button').contains('add_shopping_cart').click();

        // Check sorting
        cy.get('.listitem').then((listItems) => {
            let sortedUnchecked = [...items.filter(i => !i.checked).map(i => i.name), newItem.name].sort();
            let sortedChecked = items.filter(i => i.checked).map(i => i.name).sort();
            let expectedOrder = [...sortedUnchecked, ...sortedChecked];

            cy.wrap(listItems).each((item, index) => {
                cy.wrap(item).should('contain.text', expectedOrder[index]);
            });
        });
    });
    //
    it("ensures newly checked items move to the correct position", () => {
        // Check "Eier"
        cy.contains("6 Stück Eier").parents('.listitem').within(() => {
            cy.get('input[type="checkbox"]').check({ force: true });
        });

        cy.get('.listitem').then((listItems) => {
            let updatedItems = items.map(i => (i.name === "Eier" ? { ...i, checked: true } : i));
            let sortedUnchecked = updatedItems.filter(i => !i.checked).map(i => i.name).sort();
            let sortedChecked = updatedItems.filter(i => i.checked).map(i => i.name).sort();
            let expectedOrder = [...sortedUnchecked, ...sortedChecked];

            cy.wrap(listItems).each((item, index) => {
                cy.wrap(item).should('contain.text', expectedOrder[index]);
            });
        });
    });

    it("ensures sorting remains correct after deleting an item", () => {
        // Delete "Brot"
        cy.contains("1 Laib Brot").parents('.listitem').within(() => {
            cy.get('clear').click();
        });

        cy.get('.listitem').then((listItems) => {
            let updatedItems = items.filter(i => i.name !== "Brot");
            let sortedUnchecked = updatedItems.filter(i => !i.checked).map(i => i.name).sort();
            let sortedChecked = updatedItems.filter(i => i.checked).map(i => i.name).sort();
            let expectedOrder = [...sortedUnchecked, ...sortedChecked];

            cy.wrap(listItems).each((item, index) => {
                cy.wrap(item).should('contain.text', expectedOrder[index]);
            });
        });
    });

    afterEach(() => {
        indexedDB.deleteDatabase('_pouch_shopping');
        cy.clearLocalStorage();
    });
});
