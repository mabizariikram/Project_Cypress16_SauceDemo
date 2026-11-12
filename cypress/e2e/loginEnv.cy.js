///<reference types="cypress" />
describe('authentification sauce Demo', () => {
    beforeEach(() => {
        //tester la même suite de tests sur plusieurs environnements sans modifier le code
        // let environment = Cypress.env("var"); si pour la version 14 cypress 
        let environment = Cypress.expose("var"); //si pour la version 16 cypress
        let url;

        switch (environment) {
            case ("recette"):
                url = "https://www.saucedemo.com/"
                break;

            case ("integration"):
                url = "https://www.saucedemo1.com/"
                break;

            case ("preprod"):
                url = "https://www.saucedemo2.com/"
                break;

            case ("prod"):
                url = "https://www.saucedemo.com/"
                break;

            default:
                url = "https://www.saucedemo.com/"
        }

        cy.visit(url)



        //cy.visit('https://www.saucedemo.com/')
    });


    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            cy.screenshot(`failure-${this.currentTest.title}`);
        }
        cy.clearCookies();
        cy.clearLocalStorage();
        sessionStorage.clear();
    });


    it('login with valid credentials', () => {
        cy.get('#user-name').type('standard_user');
        cy.get('#password').type('secret_sauce');
        cy.get('#login-button').click();
        cy.url().should('include', '/inventory.html');

    });

    it('login with invalid credentials', () => {
        cy.get('#user-name').type('invalid_user');
        cy.get('#password').type('invalid_password');
        cy.get('#login-button').click();
        //cy.get('[data-test="error"]').should('be.visible');
        cy.get('[data-test="error"]').should('be.visible').and('contain', 'Username and password do not match any user in this service');
    });


});