import Vue from "vue";
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import cuid from "cuid";

import PouchDB from 'pouchdb'
import findplugin from 'pouchdb-find'
PouchDB.plugin(findplugin)

// this will be the PouchDB database
var db = new PouchDB('shopping');

// template shopping list object
const sampleShoppingList = {
  "_id": "",
  "type": "list",
  "version": 1,
  "title": "",
  "checked": false,
  "place": {
    "title": "",
    "license": null,
    "lat": null,
    "lon": null,
    "address": {}
  },
  "createdAt": "",
  "updatedAt": ""
};

// template shopping list item object
const sampleListItem = {
  "_id": "",
  "type": "item",
  "version": 1,
  "title": "",
  "itemQuantity": "",
  "itemUnit": "",
  "category": "", // New field for category
  "checked": false,
  "createdAt": "",
  "updatedAt": ""
};

/**
 * Sort comparison function to sort an object by "createdAt" field
 *
 * @param  {String} a
 * @param  {String} b
 * @returns {Number}
 */
const newestFirst = (a, b) => {
  if (a.createdAt > b.createdAt) return -1;
  if (a.createdAt < b.createdAt) return 1;
  return 0 
};

/**
 * Perform an "AJAX" request i.e call the URL supplied with the 
 * a querystring constructed from the supplied object
 *
 * @param  {String} url 
 * @param  {Object} querystring 
 * @returns {Promise}
 */
const ajax = function (url, querystring) {
  return new Promise(function(resolve, reject) {

    // construct URL
    var qs = [];
    for(var i in querystring) { qs.push(i + '=' + encodeURIComponent(querystring[i]))}
    url = url + '?' + qs.join('&');

    // make HTTP GET request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          var obj = JSON.parse(xmlhttp.responseText);
          resolve(obj);
        } else {
          reject(null);
        }
      }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  });
};

// Vue Material plugin
Vue.use(VueMaterial);

// Vue Material theme
Vue.material.registerTheme('default', {
  primary: 'blue',
  accent: 'white',
  warn: 'red',
  background: 'grey'
});

// this is the Vue.js app. It contains
// el - the HTML element where the app is rendered
// data - the data the app needs to be rendered
// computed - derived data required for the display logic
// method - JavaScript functions
var app = new Vue({
  el: '#app',
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
    selectedItem: null, // Holds the currently selected item for detail view
    newItemTitle:'',
    newItemQuantity:'',
    newItemUnit:'',
    newItemCategory: "Other", // Default category
    predefinedCategories: ["Fruits", "Vegetables", "Meat", "Dairy", "Bakery", "Beverages", "Snacks", "Household", "Other"], // Predefined categories
    dictionary: [],
    filteredSuggestions: [],
  },
  // computed functions return data derived from the core data.
  // if the core data changes, then this function will be called too.
  computed: {
    /**
     * Calculates the counts of items and which items are checked
     * grouped by shopping list
     * 
     * @returns {Object}
     */
    counts: function() {
      var obj = {};
      // count #items and how many are checked
      for(var i in this.shoppingListItems) {
        var d = this.shoppingListItems[i];
        if (!obj[d.list]) {
          obj[d.list] = { total: 0, checked: 0};
        }
        obj[d.list].total++;
        if (d.checked) {
          obj[d.list].checked++;
        }
      }
      return obj;
    },
    /**
     * Calculates the shopping list but sorted into
     * date order - newest first
     * 
     * @returns {Array}
     */
    sortedShoppingLists: function() {
      return this.shoppingLists.sort(newestFirst);
    },
    /**
     * Calculates the shopping list items but sorted into
     * unchecked items first, after that in alphabetical order
     * @returns {Array}
     */
    sortedShoppingListItems: function() {
      return this.shoppingListItems.sort((a, b) => {
        if (a.checked === b.checked) {
          return a.title.localeCompare(b.title);
        }
        return a.checked ? 1 : -1;
      });
    },
    /**
     * Groups shopping list items by category and sorts them within each group.
     * 
     * @returns {Object}
     */
    groupedShoppingListItems: function() {
      return this.sortedShoppingListItems.reduce((groups, item) => {
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
  },
  /**
   * Called once when the app is first loaded
   */
  created: function() {

    // create database index on 'type'
    db.createIndex({ index: { fields: ['type'] }}).then(() => {
      
      // load all 'list' items 
      var q = {
        selector: {
          type: 'list'
        }
      };
      return db.find(q);
    }).then((data) => {

      // write the data to the Vue model, and from there the web page
      app.shoppingLists = data.docs;

      // get all of the shopping list items
      var q = {
        selector: {
          type: 'item'
        }
      };
      return db.find(q);
    }).then((data) => {
      // write the shopping list items to the Vue model
      app.shoppingListItems = data.docs;

      // load settings (Cloudant sync URL)
      return db.get('_local/user');
    }).then((data) => {
      // if we have settings, start syncing
      this.syncURL = data.syncURL;
      this.startSync();
    }).catch((e) => {})

    this.loadDictionary();
  },
  methods: {
    /**
     * Called when the settings button is pressed. Sets the mode
     * to 'settings' so the Vue displays the settings panel.
     */
    onClickSettings: function() {
      this.mode = 'settings';
    },
    /**
     * Called when the about button is pressed. Sets the mode
     * to 'about' so the Vue displays the about panel.
     */
    onClickAbout: function() {
      this.mode = 'about';
    },    
    /**
     * Saves 'doc' to PouchDB. It first checks whether that doc
     * exists in the database. If it does, it overwrites it - if
     * it doesn't, it just writes it. 
     * @param {Object} doc
     * @returns {Promise}
     */
    saveLocalDoc: function(doc) {
      return db.get(doc._id).then((data) => {
        doc._rev = data._rev;
        return db.put(doc);
      }).catch((e) => {
        return db.put(doc);
      });
    },
    /**
     * Called when save button on the settings panel is clicked. The
     * Cloudant sync URL is saved in PouchDB and the sync process starts.
     */
    onClickStartSync: function() {
      var obj = {
        '_id': '_local/user',
        'syncURL': this.syncURL
      };
      this.saveLocalDoc(obj).then( () => {
        this.startSync();
      });
    },
    /**
     * Called when the sync process is to start. Initiates a PouchDB to
     * to Cloudant two-way sync and listens to the changes coming in
     * from the Cloudant feed. We need to monitor the incoming change
     * so that the Vue.js model is kept in sync.
     */
    startSync: function() {
      this.syncStatus = 'notsyncing';
      if (this.sync) {
        this.sync.cancel();
        this.sync = null;
      }
      if (!this.syncURL) { return; }
      this.syncStatus = 'syncing';
      this.sync = db.sync(this.syncURL, {
        live: true,
        retry: false
      }).on('change', (info) => {
        // handle change
        // if this is an incoming change
        if (info.direction == 'pull' && info.change && info.change.docs) {

          // loop through all the changes
          for(var i in info.change.docs) {
            var change = info.change.docs[i];
            var arr = null;

            // see if it's an incoming item or list or something else
            if (change._id.match(/^item/)) {
              arr = this.shoppingListItems;
            } else if (change._id.match(/^list/)) {
              arr = this.shoppingLists;
            } else {
              continue;
            }

            // locate the doc in our existing arrays
            var match = this.findDoc(arr, change._id);

            // if we have it already 
            if (match.doc) {
              // and it's a deletion
              if (change._deleted == true) {
                // remove it
                arr.splice(match.i, 1);
              } else {
                // modify it
                delete change._revisions;
                Vue.set(arr, match.i, change);
              }
            } else {
              // add it
              if (!change._deleted) {
                arr.unshift(change);
              }
            }
          }
        }
      }).on('error', (e) => {
        this.syncStatus = 'syncerror';
      }).on('denied', (e) => {
        this.syncStatus = 'syncerror';
      }).on('paused', (e) => {
        if (e) {
          this.syncStatus = 'syncerror';
        }
      });;
    },

    /**
     * Given a list of docs and an id, find the doc in the list that has
     * an '_id' (key) that matches the incoming id. Returns an object 
     * with the 
     *   i - the index where the item was found
     *   doc - the matching document
     * @param {Array} docs
     * @param {String} id
     * @param {String} key
     * @returns {Object}
     */
    findDoc: function (docs, id, key) {
      if (!key) {
        key = '_id';
      }
      var doc = null;
      for(var i in docs) {
        if (docs[i][key] == id) {
          doc = docs[i];
          break;
        }
      }
      return { i: i, doc: doc };
    },

    /**
     * Given a list of docs and an id, find the doc in the list that has
     * an '_id' (key) that matches the incoming id. Updates its "updatedAt"
     * attribute and write it back to PouchDB.
     *   i - the index where the item was found
     *   doc - the matching document
     * @param {Array} docs
     * @param {String} id

     */
    findUpdateDoc: function (docs, id) {

      // locate the doc
      var doc = this.findDoc(docs, id).doc;

      // if it exits
      if (doc) {
        
        // modift the updated date
        doc.updatedAt = new Date().toISOString();

        // write it on the next tick (to give Vue.js chance to sync state)
        this.$nextTick(() => {

          // write to database
          db.put(doc).then((data) => {

            // retain the revision token
            doc._rev = data.rev;
          });
        });
      }
    },

    /**
     * Called when the user clicks the Add Shopping List button. Sets
     * the mode to 'addlist' to reveal the add shopping list form and
     * resets the form variables.
     */
    onClickAddShoppingList: function() {

      // open shopping list form
      this.singleList = JSON.parse(JSON.stringify(sampleShoppingList));
      this.singleList._id = 'list:' + cuid();
      this.singleList.createdAt = new Date().toISOString();
      this.pagetitle = 'New Shopping List';
      this.places = [];
      this.selectedPlace = null;
      this.mode='addlist';
    },

    /**
     * Called when the Save Shopping List button is pressed.
     * Writes the new list to PouchDB and adds it to the Vue 
     * model's shoppingLists array
     */
    onClickSaveShoppingList: function() {

      // add timestamps
      this.singleList.updatedAt = new Date().toISOString();

      // add to on-screen list, if it's not there already
      if (typeof this.singleList._rev === 'undefined') {
        this.shoppingLists.unshift(this.singleList);
      }
      
      // write to database
      db.put(this.singleList).then((data) => {
        // keep the revision tokens
        this.singleList._rev = data.rev;

        // switch mode
        this.onBack();
      });
    },

    /**
     * Called when the Back button is pressed. Returns to the
     * home screen with a lit of shopping lists.
     */
    onBack: function() {
      this.mode='showlist';
      this.pagetitle='Shopping Lists';
    },

    /**
     * Called when the Edit button is pressed next to a shopping list.
     * We locate the list document by id and change mode to "addlist",
     * pre-filling the form with that document's details.
     * @param {String} id
     * @param {String} title
     */
    onClickEdit: function(id, title) {
      this.singleList = this.findDoc(this.shoppingLists, id).doc;
      this.pagetitle = 'Edit - ' + title;
      this.places = [];
      this.selectedPlace = null;
      this.mode='addlist';
    },

    /**
     * Called when the delete button is pressed next to a shopping list.
     * The shopping list document is located, removed from PouchDB and
     * removed from Vue's shoppingLists array.
     * @param {String} id
     */
    onClickDelete: function(id) {
      var match = this.findDoc(this.shoppingLists, id);
      db.remove(match.doc).then(() => {
        this.shoppingLists.splice(match.i, 1);
      });
    },

    // the user wants to see the contents of a shopping list
    // we load it and switch views
    /**
     * Called when the user wants to edit the contents of a shopping list.
     * The mode is set to 'itemedit'. Vue's currentListId is set to this list's
     * id field.
     * @param {String} id
     * @param {String} title
     */
    onClickList: function(id, title) {
      this.currentListId = id;
      this.pagetitle = title;
      this.mode = 'itemedit';
    },

    /**
     * Loads the dictionary of words for the current language
     */
    async loadDictionary() {
        try {
            const response = await fetch('./assets/dictionary/items-' + this.lang + '.txt');
            const text = await response.text();
            this.dictionary = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
            console.log("loaded dictionary with (" + this.lang + ")", this.dictionary.length, "words");
        } catch (error) {
            console.error('Error loading dictionary:', error);
        }
    },
    /**
     * Filters the dictionary of words based on the current input
     */
    filterSuggestions() {
        const query = this.newItemTitle.toLowerCase();
        if (!query) {
            this.filteredSuggestions = [];
            return;
        }
        this.filteredSuggestions = this.dictionary.filter(word => word.toLowerCase().startsWith(query));
        this.highlightedIndex = -1;
    },
    /**
     * Selects a suggestion from the filtered list
     * it selects the clicked word
     * @param {String} word
     */
    selectSuggestion(word) {
        this.newItemTitle = word;
        this.filteredSuggestions = [];
    },

    /**
     * Called when a new shopping list item is added. A new shopping list item
     * object is created with a unique id. It is written to PouchDB and added
     * to Vue's shoppingListItems array
     */
    onAddListItem: function() {
      if (!this.newItemTitle) return;

      var obj = JSON.parse(JSON.stringify(sampleListItem));
      obj._id = 'item:' + cuid();
      obj.title = this.newItemTitle;

      // Default quantity to 1 if not provided
      obj.quantity = this.newItemQuantity ? this.newItemQuantity : 1;

      // Unit can remain empty
      obj.unit = this.newItemUnit || '';

      // Assign category from dropdown
      obj.category = this.newItemCategory;

      obj.list = this.currentListId;
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();

      db.put(obj).then((data) => {
        obj._rev = data.rev;
        this.shoppingListItems.unshift(obj);
        this.newItemTitle = '';
        this.newItemQuantity = '';
        this.newItemUnit = '';
        this.newItemCategory = "Other"; // Reset category to default
      });
    },

    /**
     * Called when an item is checked or unchecked from a shopping list.
     * The item is located and written to PouchDB
     * @param {String} id
     */
    onCheckListItem: function(id) {
      this.findUpdateDoc(this.shoppingListItems, id);
    },

    /**
     * Called when the Lookup button is pressed. We make an API call to 
     * OpenStreetMap passing in the user-supplied name of the place. If
     * the API returns something, the options are added to Vue's "places"
     * array and become a pull-down list of options on the front end.
     */
    onClickLookup: function() {

      // make request to the OpenStreetMap API
      var url = 'https://nominatim.openstreetmap.org/search';
      var qs = {
        format: 'json',
        addressdetails: 1, 
        namedetails: 1,
        q: this.singleList.place.title
      };
      ajax(url, qs).then((d) => {

        // add the list of places to our list
        this.places = d;

        // if there is only one item in the list
        if (d.length ==1) {
          // simulate selection of first and only item
          this.onChangePlace(d[0].place_id);
        }
      });

    },

    // when a place is selected from the list, we find the object in the list
    // and copy the lat/long, licence and name over to our database
    /**
     * Called when an item is selected from the places pull-down list. The
     * place is found in the "places" array and its lat/long, licnece and 
     * address are moved to the Vue object linked with the front-end form.
     * @param {String} v
     */
    onChangePlace: function(v) {
      var doc = this.findDoc(this.places, v, 'place_id').doc;
      this.singleList.place.lat = doc.lat;
      this.singleList.place.lon = doc.lon;
      this.singleList.place.license = doc.licence;
      this.singleList.place.address = doc.address;
     },

    /**
     * Called when an item is deleted from a shopping list. We locate the item
     * in the list, delete it from PouchDB and remove it from the shoppingListItems
     * Vue array.
     * @param {String} id
     */
     onDeleteItem: function(id) {
       var match = this.findDoc(this.shoppingListItems, id);
       db.remove(match.doc).then((data) => {
         this.shoppingListItems.splice(match.i, 1);
       });
    },
    
    onBackToList: function() {
      this.mode = 'itemedit'; // Wechsle zurück zur Listenansicht
      // Optional: Stelle sicher, dass die richtige Liste angezeigt wird
      this.currentListId = this.selectedItem.list;
      this.selectedItem = null; // Leere das ausgewählte Item
    },

    /**
     * Called when the info button is clicked for a shopping list item.
     * Sets the selected item and switches to the detail view mode.
     * @param {Object} item
     */
    onShowItemDetail: function(item) {
      this.selectedItem = JSON.parse(JSON.stringify(item));
      this.mode = 'itemdetail';
    },
    /**
     * Called when the Save button is clicked in the item detail view.
     * Updates the item in PouchDB and the Vue model.
     */
    onSaveItemDetail: function() {
      this.selectedItem.updatedAt = new Date().toISOString();
      db.put(this.selectedItem).then((data) => {
        this.selectedItem._rev = data.rev;
        const match = this.findDoc(this.shoppingListItems, this.selectedItem._id);
        Vue.set(this.shoppingListItems, match.i, this.selectedItem);
        this.onBackToList();
      });
    },
  }
})

window.app = app;
