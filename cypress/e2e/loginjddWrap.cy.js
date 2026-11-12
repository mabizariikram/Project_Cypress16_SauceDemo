describe('Authentification SauceDemo', () => {

    it('Login with JSON fixture list', () => {

        cy.fixture('jdd_ListJson.json').then((data) => {

            cy.wrap(data).each((user) => {

                cy.visit('https://www.saucedemo.com/')

                cy.get('#user-name').clear().type(user.username)
                cy.get('#password').clear().type(user.password)

                cy.get('#login-button').click()

                if (user.result === 'success') {

                    cy.url().should('include', '/inventory.html')

                } else if (user.result === 'failure') {

                    cy.get('[data-test="error"]')
                        .should('be.visible')

                }

            })

        })

    })

})