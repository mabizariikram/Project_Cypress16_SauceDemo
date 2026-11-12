//directive TypeScript de référence de triple-slash (triple-slash directive)
///<reference types="cypress" />  
describe('authentification sauce Demo', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/')
    });


    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            cy.screenshot(`failure-${this.currentTest.title}`);
        }
        // cy.clearCookies();
        // cy.clearLocalStorage();
        // sessionStorage.clear();
        
        cy.clearSession();
    });


    it('login with valid credentials ',{tags: '@smoke'}, () => {
        cy.connexion('standard_user', 'secret_sauce');
        
        // cy.get('#user-name').type('standard_user');
        // cy.get('#password').type('secret_sauce');
        // cy.get('#login-button').click();

        cy.url().should('include', '/inventory.html');
        cy.logout();

    });

    it('login with invalid credentials ', { tags: ['@regression','@smoke']}, () => {
        cy.connexion('invalid_user', 'invalid_password');

        // cy.get('#user-name').type('invalid_user');
        // cy.get('#password').type('invalid_password');
        // cy.get('#login-button').click();

        //cy.get('[data-test="error"]').should('be.visible');
        cy.get('[data-test="error"]').should('be.visible').and('contain', 'Username and password do not match any user in this service');
    
    });

});