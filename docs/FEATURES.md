# Feature Documentation

## Structure
Each feature is documented with the following sections:
- **Description**: A brief overview of the feature.
- **Backend Implementation**: Relevant methods and logic in the backend.
- **Frontend Implementation**: UI components and their behavior.
- **Test Cases**: Test scenarios to ensure the feature works as expected.

---

## Detail View

### Description
The Detail View allows users to view, edit, and save details of a specific shopping list item. Users can also cancel changes and return to the list view.

---

### Backend Implementation
#### Methods in `shoppinglist.js`
1. **`onShowItemDetail(item)`**
   - Sets the selected item for the detail view.
   - Changes the mode to `itemdetail`.

2. **`onSaveItemDetail()`**
   - Updates the selected item's details in the database.
   - Updates the Vue model and returns to the list view.

3. **`onBackToList()`**
   - Cancels changes and switches back to the list view.
   - Resets the `selectedItem` variable.

---

### Frontend Implementation
#### Info Button
- **Location**: Inside the shopping list item editor (`mode == 'itemedit'`).
- **Purpose**: Opens the detail view for a specific item.
- **Code Snippet**:
  ```html
  <!-- shopping list item detail button -->
  <md-button v-on:click="onShowItemDetail(item)" class="md-icon-button md-list-action" :data-testid="`btn-item-detail-${item.title}`">
    <md-icon>info</md-icon>
  </md-button>
  ```

#### Detail View Card
- **Location**: Displayed when `mode == 'itemdetail'`.
- **Purpose**: Allows users to view and edit item details.
- **Code Snippet**:
  ```html
   <!-- item detail view -->
      <md-card v-if="mode == 'itemdetail'" class="item-detail-card" data-testid="item-detail-card">
        <md-card-header class="item-detail-header">
          <div class="item-detail-title">Item Details</div>
        </md-card-header>
        <md-card-content class="item-detail-content">
          <!-- item title -->
          <md-input-container class="item-detail-input">
            <label>Item Name</label>
            <md-input v-model="selectedItem.title" data-testid="input-item-title"></md-input>
          </md-input-container>

          <!-- item checked status -->
          <div class="item-detail-checkbox">
            <md-checkbox v-model="selectedItem.checked" class="md-primary" data-testid="checkbox-item-checked"></md-checkbox>
            <label>Checked</label>
          </div>
        </md-card-content>

        <md-card-actions class="item-detail-actions">
          <!-- save button -->
          <md-button class="save-button" v-on:click="onSaveItemDetail" data-testid="btn-save-item-detail">Save</md-button>
          <!-- cancel button -->
          <md-button class="cancel-button" v-on:click="onBackToList" data-testid="btn-cancel-item-detail">Cancel</md-button>
        </md-card-actions>
      </md-card>
    ```

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


## **Sync Status Feature**

### **Description**
The **Sync Status** feature displays the current sync state (`notsyncing`, `syncing`, `syncerror`) using Material Design chips in the UI. It updates based on the sync process with CouchDB.

### **Backend Implementation**
- The `startSync()` method in Vue triggers synchronization with CouchDB via PouchDB.  
- The sync status is updated (`notsyncing`, `syncing`, `syncerror`) based on sync events.

```javascript
startSync: function() {
  this.sync = db.sync(this.syncURL, { live: true, retry: false })
    .on('change', () => { /* update sync status */ })
    .on('error', () => { this.syncStatus = 'syncerror'; });
}
```

### **Frontend Implementation**
- Displays sync status as `md-chip` components depending on `syncStatus`.
- Hidden in **Settings** or **About** modes.

```vue
<md-chip v-if="syncStatus == 'notsyncing'">Not Syncing</md-chip>
<md-chip v-if="syncStatus == 'syncing'" class="md-success">Syncing</md-chip>
<md-chip v-if="syncStatus == 'syncerror'" class="md-warn">Sync Error</md-chip>
```

### **Test Cases**
- **"Not Syncing"** when `syncStatus` is `notsyncing`
- **"Syncing"** when `syncStatus` is `syncing`
- **"Sync Error"** when `syncStatus` is `syncerror`
- Sync status chips should be hidden in **Settings** and **About** modes.

## Feature Documentation: Grouping Items by Category

### Description
The **Grouping Items by Category** feature organizes shopping list items into predefined categories (e.g., Fruits, Vegetables, Dairy). Items without a category are grouped under "Other". This feature enhances the user experience by providing a structured view of the shopping list.

---

### Backend Implementation

#### Methods in `shoppinglist.js`

1. **`groupedShoppingListItems` (computed property)**  
   - Groups shopping list items by their `category` attribute.  
   - Items without a category are grouped under "Other".  
   - Filters items to only include those belonging to the currently selected list.  

   **Code Snippet**:
   ```javascript
   groupedShoppingListItems: function() {
     return this.shoppingListItems.reduce((groups, item) => {
       if (item.list === this.currentListId) {
         const category = item.category || "Other";
         if (!groups[category]) {
           groups[category] = [];
         }
         groups[category].push(item);
       }
       return groups;
     }, {});
   }
   ```

2. **`onAddListItem()`**  
   - Assigns a category to a new item based on the user's selection.  
   - Defaults to "Other" if no category is selected.  

   **Code Snippet**:
   ```javascript
   onAddListItem: function() {
     var obj = JSON.parse(JSON.stringify(sampleListItem));
     obj.category = this.newItemCategory || "Other";
     // ...existing code...
   }
   ```

3. **`onSaveItemDetail()`**  
   - Updates the category of an item in the detail view.  
   - Saves the updated item to the database and Vue model.  

   **Code Snippet**:
   ```javascript
   onSaveItemDetail: function() {
     this.selectedItem.updatedAt = new Date().toISOString();
     db.put(this.selectedItem).then((data) => {
       this.selectedItem._rev = data.rev;
       const match = this.findDoc(this.shoppingListItems, this.selectedItem._id);
       Vue.set(this.shoppingListItems, match.i, this.selectedItem);
       this.onBackToList();
     });
   }
   ```

---

### Frontend Implementation

#### Grouped Items Display
- **Location**: Inside the shopping list item editor (`mode == 'itemedit'`).  
- **Purpose**: Displays items grouped by category with headers for each category.  
- **Code Snippet**:
  ```html
  <!-- shopping list items grouped by category -->
  <div v-for="(items, category) in groupedShoppingListItems" :key="category">
    <h3 class="category-header">{{ category }}</h3>
    <md-list-item class="listitem" v-for="item in items" :key="item._id">
      <!-- ...existing code for item display... -->
    </md-list-item>
  </div>
  ```

#### Category Dropdown
- **Location**: In both the item editor and detail view.  
- **Purpose**: Allows users to assign a category to an item.  
- **Code Snippet**:
  ```html
  <md-select v-model="newItemCategory" data-testid="select-item-category">
    <md-option v-for="category in predefinedCategories" :key="category" :value="category" :data-testid="`option-category-${category}`">
      {{ category }}
    </md-option>
  </md-select>
  ```

---

### Test Cases

#### Grouping Items by Category
1. **Add items with different categories**  
   - Input: Add items with categories "Fruits", "Dairy", and "Meat".  
   - Expected: Items are grouped under their respective category headers.  

   **Test Code**:
   ```javascript
   it('Groups items correctly by category', () => {
     cy.get('.category-header').contains('Fruits').should('exist');
     cy.get('.category-header').contains('Dairy').should('exist');
     cy.get('.category-header').contains('Meat').should('exist');
   });
   ```

2. **Add an item without a category**  
   - Input: Add an item without selecting a category.  
   - Expected: Item is grouped under the "Other" category.  

   **Test Code**:
   ```javascript
   it('Displays "Other" for items without a category', () => {
     cy.get('.category-header').contains('Other').should('exist');
     cy.get('.category-header').contains('Other').nextUntil('.category-header').should('contain.text', 'Bread');
   });
   ```

3. **Change an item's category**  
   - Input: Change the category of an item from "Dairy" to "Beverages".  
   - Expected: Item is moved to the "Beverages" group, and "Dairy" is removed if empty.  

   **Test Code**:
   ```javascript
   it('Updates grouping when an item category is changed', () => {
     cy.get('.category-header').contains('Beverages').nextUntil('.category-header').should('contain.text', 'Milk');
     cy.get('body').then(($body) => {
       if ($body.find('.category-header:contains("Dairy")').length > 0) {
         cy.get('.category-header').contains('Dairy').nextUntil('.category-header').should('not.contain.text', 'Milk');
       }
     });
   });
   ```

4. **Remove all items from a category**  
   - Input: Delete all items in the "Fruits" category.  
   - Expected: The "Fruits" category header is removed.  

   **Test Code**:
   ```javascript
   it('Handles empty categories gracefully', () => {
     cy.get('.category-header').contains('Fruits').should('not.exist');
   });
   ```


## Item Sorting

### **What It Does**
It returns a **sorted version** of the `shoppingListItems` array such that:
1. **Unchecked items come first** (i.e. items the user hasn't bought yet).
2. Within the unchecked and checked groups, items are sorted **alphabetically by title**.

---

### **How It Works (Line-by-Line)**

```js
sortedShoppingListItems: function() {
  return this.shoppingListItems.sort((a, b) => {
```
- This uses JavaScript’s `.sort()` method to reorder the `shoppingListItems` array.
- The sorting is done by comparing **two items** (`a` and `b`) at a time.

---

```js
    if (a.checked === b.checked) {
      return a.title.localeCompare(b.title);
    }
```
- If both items have the **same checked status** (both checked or unchecked), it compares them **alphabetically by their `title`** using `localeCompare`.

---

```js
    return a.checked ? 1 : -1;
```
- If the checked status **differs**, this line ensures:
  - `a.checked === false` (unchecked) puts `a` **before** `b`.
  - `a.checked === true` (checked) puts `a` **after** `b`.

