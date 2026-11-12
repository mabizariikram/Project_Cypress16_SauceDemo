/// <reference types="cypress" />
describe('authentification sauce Demo', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            cy.screenshot(`failure-${this.currentTest.title}`)
        }
        cy.clearCookies()
        cy.clearLocalStorage()
        sessionStorage.clear()
    })

    it('login with valid credentials', () => {
        cy.get('#user-name').type('standard_user')
        cy.get('#password').type('secret_sauce')
        cy.get('#login-button').click()
        cy.url().should('include', '/inventory.html')
    })

    it('login with invalid credentials', () => {
        cy.get('#user-name').type('invalid_user')
        cy.get('#password').type('invalid_password')
        cy.get('#login-button').click()
        cy.get('[data-test="error"]')
            .should('be.visible')
            .and('contain', 'Username and password do not match any user in this service')
    })
})