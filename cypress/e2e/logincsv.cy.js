import csv from 'csvtojson'

describe('login sauce demo with CSV', () => {

    it('login with CSV data', () => {

        cy.readFile('cypress/fixtures/jdd.csv').then((csvData) => {
            //sert à lire et convertir des données CSV en tableau d’objets JavaScript.
            csv().fromString(csvData).then((users) => {

                users.forEach((user) => {

                    cy.visit('https://www.saucedemo.com/')

                    cy.get('#user-name').type(user.username)
                    cy.get('#password').type(user.password)
                    cy.get('#login-button').click()

                    if (user.result === "success") {
                        cy.url().should('include', '/inventory.html')
                    } else {
                        cy.get('[data-test="error"]').should('be.visible')
                    }

                })

            })

        })

    })

})