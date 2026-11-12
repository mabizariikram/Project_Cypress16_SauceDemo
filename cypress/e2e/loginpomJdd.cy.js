/// <reference types="cypress"/>

import LoginPage from '../pages/login.page.js'

describe("Login tests - Data Driven POM", () => {
    //Variable qui va stocker les données du fichier JSON
    let users

    before(() => {
        // data contient le contenu du JSON.
        cy.fixture('jdd_ListJson').then((data) => {
            users = data
        })
    })
    //? est l’optional chaining :évite une erreur si users est undefined.
    users?.forEach((user) => {

        it(`Login test for ${user.username}`, () => {

            cy.visit("https://www.saucedemo.com/")

            LoginPage.login(user.username, user.password)

            if (user.result === "success") {
                cy.url().should("include", "/inventory")
            } else {
                LoginPage.getErrorMsg().should("be.visible")
            }

        })

    })

})