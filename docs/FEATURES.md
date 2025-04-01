# Feature Documentation

## Structure
Each feature is documented with the following sections:
- **Description**: A brief overview of the feature.
- **Backend Implementation**: Relevant methods and logic in the backend.
- **Frontend Implementation**: UI components and their behavior.
- **Test Cases**: Test scenarios to ensure the feature works as expected.

---

## Item Quantity and Unit

### Description

This function allows the user to add quantity and unit measurements to his item. This is also implemented in the Detail View.

---

### Backend Implementation

#### Modifications in `shoppinglist.js`:

1. **`sampleListItem = {...}`**
    - We have to modify this Constant to add our new attributes that should also be integrated into the database.

**New `sampleListItem` object**:

```javascript
  // template shopping list item object
  const sampleListItem = {
    "_id": "",
    "type": "item",
    "version": 1,
    "title": "",
    "itemQuantity": "", // quantity for item
    "itemUnit": "", // unit for item
    "checked": false,
    "createdAt": "",
    "updatedAt": ""
  };
```

2. **`data` attribute in the app**:

  - We also have to add our two new attributes here, to enable a quick and easy communication with the UI components.

**New Attributes added into `data`**:

```javascript
    data: {
      lang: 'de',
      mode: 'showlist',
      pagetitle: 'Shopping Lists',
      shoppingLists: [],
      shoppingListItems: [],
      singleList: null,
      currentListId: null,
      places: [],
      selectedPlace: null,
      syncURL:'',
      syncStatus: 'notsyncing',
      selectedItem: null,
      newItemTitle:'', 
      newItemQuantity:'', //quantity for new item
      newItemUnit:'', // unit for new item
      dictionary: [],
      filteredSuggestions: [],
    }
```

3. **`onAddListItem()` function**:

  - Function is called, when a new item is created.
  - Saves the item, therefore we also have to add our two new attributes into here.
  - Also: If no quantity given, then the default value is 1. 
  - If no unit is given, then the field is just empty as the value is not necessarily needed.

**New `onAddListItem()` function**:

```javascript
onAddListItem: function() {
    if (!this.newItemTitle) return;

    var obj = JSON.parse(JSON.stringify(sampleListItem));
    obj._id = 'item:' + cuid();
    obj.title = this.newItemTitle;

    // Wenn keine Quantity eingegeben wurde → default auf 1
    obj.quantity = this.newItemQuantity ? this.newItemQuantity : 1;

    // Unit darf leer bleiben
    obj.unit = this.newItemUnit || '';

    obj.list = this.currentListId;
    obj.createdAt = new Date().toISOString();
    obj.updatedAt = new Date().toISOString();

    db.put(obj).then((data) => {
        obj._rev = data.rev;
        this.shoppingListItems.unshift(obj);
        this.newItemTitle = '';
        this.newItemQuantity = '';
        this.newItemUnit = '';
    });
}
```

### Frontend Implementation


#### Modifications in `index.html`:

1. **Inclusion of the new form fields**:

  - Important to first add two new form fields, one for the Quantity and one for the Unit. Each should be connected to the Vue Model via `v-model`

**New HTML code in list view**:

```html
    <md-input-container class="input-small">
        <md-input v-model="newItemQuantity" placeholder="Quantity" @keyup.enter.native="onAddListItem"></md-input>
    </md-input-container>

    <md-input-container class="input-small">
        <md-input v-model="newItemUnit" placeholder="Unit" @keyup.enter.native="onAddListItem"></md-input>
    </md-input-container>
```

2. **Integration in the Detail View**:

  - Because these new attributes should be the new standard items, it is also important that they get added into the Detail View. There, they may be modified and saved.

**New HTML Code in Detail View**:

```html
            <!-- Item Quantity -->
    <md-input-container class="item-detail-input">
        <label>Item Quantity</label>
        <md-input v-model="selectedItem.quantity"></md-input>
    </md-input-container>
            <!-- Item Unit -->
    <md-input-container class="item-detail-input">
        <label>Item Unit</label>
        <md-input v-model="selectedItem.unit"></md-input>
    </md-input-container>
```

#### Modifications in `shoppinglist.css`:

- Due to the additional two new form fields, the stylesheet had to be modified in order to provide a clean look. 
- Here the requirement was, to make the Quantity and Unit fields shorter and for the item field to just take up the rest of the available space.

**New Stylesheet components**:

```css
.item-input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 16px 0;
}

.item-input-row .input-small {
  flex: 0 0 80px;
}

.item-input-row .input-wide {
  flex: 1;
}

.item-input-row .suggestions {
  margin-top: -8px;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 150px;
  overflow-y: auto;
}

.item-input-row .suggestion-word {
  padding: 8px;
  cursor: pointer;
}

.item-input-row .suggestion-word:hover {
  background-color: #eee;
}

.suggestion-wrapper {
  position: relative;
  flex: 1;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
}

.suggestion-word {
  padding: 8px;
  cursor: pointer;
}

.suggestion-word:hover {
  background-color: #eee;
}

```

### Test Cases

We have the following Cypress Test Cases:

#### Add item with quantity and unit

- Input: `3 kg Kartoffeln`
- Expected: Item appears as `3 kg Kartoffeln`

```javascript
    it('should allow adding an item with quantity and unit', () => {
        cy.get('.input-small input').eq(0).type('3'); // quantity
        cy.get('.input-small input').eq(1).type('kg'); // unit
        cy.get('.input-wide input').type('Kartoffeln');
        cy.get('button').contains('add_shopping_cart').click();

        // Überprüfung
        cy.get('.md-list-text-container').should('contain', '3 kg Kartoffeln');
    });
```

#### Add item with only name (no quantity/unit)

- Input: `Bananen`
- Expected: Defaults to `1 Bananen`

```javascript
    it('should show quantity as 1 and unit as empty if not provided', () => {
        // Leere quantity und unit, nur Titel angeben
        cy.get('.input-small input').eq(0).clear();
        cy.get('.input-small input').eq(1).clear();
        cy.get('.input-wide input').type('Bananen');
        cy.get('button').contains('add_shopping_cart').click();

        // Erwartet: "1  Bananen"
        cy.get('.md-list-text-container').should('contain', '1  Bananen');
    });
```

#### Add item with quantity but no unit

- Input: `5 Eier`
- Expected: Appears as `5 Eier`

```javascript
    it('should allow adding an item with only quantity and no unit', () => {
        cy.get('.input-small input').eq(0).type('5'); // quantity
        cy.get('.input-small input').eq(1).clear();   // unit leer
        cy.get('.input-wide input').type('Eier');
        cy.get('button').contains('add_shopping_cart').click();

        cy.get('.md-list-text-container').should('contain', '5  Eier');
    });
```

#### Add item with unit but no quantity

- Input: `Stück Apfel`
- Expected: Defaults to `1 Stück Apfel`

```javascript
    it('should allow adding an item with only unit and no quantity → default to 1', () => {
        cy.get('.input-small input').eq(0).clear();    // quantity leer → default = 1
        cy.get('.input-small input').eq(1).type('Stück'); // unit gesetzt
        cy.get('.input-wide input').type('Apfel');
        cy.get('button').contains('add_shopping_cart').click();

        cy.get('.md-list-text-container').should('contain', '1 Stück Apfel');
    });
```

#### Create and check an item

- Input: `6 Stück Eier`
- Stepts:
  - Add item with quantity + unit
  - Mark the tem as `checked` via checkbox
  - Expected: Checkbox is checked (item marked as purchased)

```javascript
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
```