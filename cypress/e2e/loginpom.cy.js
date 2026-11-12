/// <reference types="cypress"/>

import LoginPage from '../pages/login.page.js'

describe("authentification avec POM", () => {

    beforeEach(() => {
        cy.visit("https://www.saucedemo.com/")
    })

    it("login with valid credentials", () => {
        // LoginPage.saisirUsername("standard_user")
        // LoginPage.saisirPassword("secret_sauce")
        // LoginPage.se_connecter()
        LoginPage.loginToApp("standard_user", "secret_sauce")
        cy.url().should("include", '/inventory')
    })

    it("login with wrong credentials", () => {
        // LoginPage.saisirUsername("wrong_user")
        // LoginPage.saisirPassword("wrong_user")
        // LoginPage.se_connecter()
        LoginPage.loginToApp("wrong_user", "wrong_user")
        LoginPage.getErrorMsg().should("be.visible")
        cy.screenshot("login_error") // capture d'écran en cas d'erreur
    })

})