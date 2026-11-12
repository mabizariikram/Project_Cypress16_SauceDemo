
import Papa from "papaparse";

describe('login sauce demo with CSV', () => {

    it('login with CSV data', () => {

        cy.readFile('cypress/fixtures/jdd.csv').then((csvData) => {

            // Lire et convertir le CSV en tableau d'objets JavaScript
            const users = Papa.parse(csvData, {
                header: true
            }).data;

            users.forEach((user) => {

                cy.visit('https://www.saucedemo.com/');

                cy.get('#user-name').type(user.username);
                cy.get('#password').type(user.password);
                cy.get('#login-button').click();

                if (user.result === "success") {
                    cy.url().should('include', '/inventory.html');
                } else {
                    cy.get('[data-test="error"]').should('be.visible');
                }

            });

        });

    });

});

