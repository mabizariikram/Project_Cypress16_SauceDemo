///<reference types="cypress" />

describe('authentification sauce Demo', () => {

    it('login with JSON list fixture', {tags: "@json"},() => {

        cy.fixture("jdd_ListJson.json").then((data) => {

            data.forEach((user) => {

                cy.visit('https://www.saucedemo.com/')

                cy.get('#user-name').clear().type(user.username)
                cy.get('#password').clear().type(user.password)
                //cy.get("#user-name").type(`{backspace}` + user.username);
                cy.get('#login-button').click()

                if (user.result == "success") {
                    cy.url().should('include', '/inventory.html')
                }
                else if (user.result == "failure") {
                    cy.get('[data-test="error"]').should('be.visible')
                }

            })

        })

    })

})