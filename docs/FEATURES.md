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