describe('Sync Status Component', () => {
  let app;

  beforeEach(() => {
    // Mount the Vue app
    cy.visit('/'); // Assuming your Vue app is served at the root
    cy.window().then((win) => {
      app = win.app; // Access the Vue app instance
    });
  });

  it('should show "Not Syncing" when syncStatus is "notsyncing"', () => {
    // Set the syncStatus to 'notsyncing'
    app.syncStatus = 'notsyncing';

    // Check that the correct chip is displayed
    cy.get('[data-testid="sync-status-not-syncing"]')
      .should('be.visible')
      .and('contain.text', 'Not Syncing');
    
    // Ensure other statuses are not displayed
    cy.get('[data-testid="sync-status-syncing"]').should('not.exist');
    cy.get('[data-testid="sync-status-sync-error"]').should('not.exist');
  });

  it('should show "Syncing" when syncStatus is "syncing"', () => {
    // Set the syncStatus to 'syncing'
    app.syncStatus = 'syncing';

    // Check that the correct chip is displayed
    cy.get('[data-testid="sync-status-syncing"]')
      .should('be.visible')
      .and('contain.text', 'Syncing');

    // Ensure other statuses are not displayed
    cy.get('[data-testid="sync-status-not-syncing"]').should('not.exist');
    cy.get('[data-testid="sync-status-sync-error"]').should('not.exist');
  });

  it('should show "Sync Error" when syncStatus is "syncerror"', () => {
    // Set the syncStatus to 'syncerror'
    app.syncStatus = 'syncerror';

    // Check that the correct chip is displayed
    cy.get('[data-testid="sync-status-sync-error"]')
      .should('be.visible')
      .and('contain.text', 'Sync Error');

    // Ensure other statuses are not displayed
    cy.get('[data-testid="sync-status-not-syncing"]').should('not.exist');
    cy.get('[data-testid="sync-status-syncing"]').should('not.exist');
  });

  it('should hide sync status chips when in "settings" mode', () => {
    // Set mode to 'settings'
    app.mode = 'settings';

    // Check that no sync status chips are displayed
    cy.get('[data-testid="sync-status-not-syncing"]').should('not.exist');
    cy.get('[data-testid="sync-status-syncing"]').should('not.exist');
    cy.get('[data-testid="sync-status-sync-error"]').should('not.exist');
  });

  it('should hide sync status chips when in "about" mode', () => {
    // Set mode to 'about'
    app.mode = 'about';

    // Check that no sync status chips are displayed
    cy.get('[data-testid="sync-status-not-syncing"]').should('not.exist');
    cy.get('[data-testid="sync-status-syncing"]').should('not.exist');
    cy.get('[data-testid="sync-status-sync-error"]').should('not.exist');
  });

});