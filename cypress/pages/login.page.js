/// <reference types="cypress"/>

class LoginPage {
    elements = {
        username: () => cy.get("#user-name"),
        password: () => cy.get("#password"),
        loginBtn: () => cy.get("#login-button"),
        error_msg: () => cy.get("h3[data-test=error]")
    }

    saisirUsername(u) {
        this.elements.username().type(u)
    }

    saisirPassword(pass) {
        this.elements.password().type(pass)
    }

    se_connecter() {
        this.elements.loginBtn().click()
    }

    getErrorMsg() {
        return this.elements.error_msg()
    }


    loginToApp(username, password) {

        this.saisirUsername(username)
        this.saisirPassword(password)
        this.se_connecter()

    }
}

export default new LoginPage()