# Projet de tests E2E avec Cypress 16

Tests automatisés de l'application [Sauce Demo](https://www.saucedemo.com/) avec Cypress 16.

Ce projet illustre : les environnements multiples, les tags, les jeux de données (JSON, CSV),
les hooks et les rapports (Mochawesome, Allure).

Projet réalisé dans le cadre d'une formation, par la formatrice **Mabizari Ikram**.

---

## Pré-requis

| Outil | Version | Vérification |
|---|---|---|
| Node.js | 22.x, 24.x ou 26 et plus | `node -v` |
| npm | fourni avec Node.js | `npm -v` |
| Java (pour Allure) | 8 ou plus | `java -version` |
| Google Chrome (recommandé) | récent | |

## Installation

```bash
npm install
npx cypress --version
```

La commande `npx cypress --version` doit afficher la même version pour le package et pour le binaire.

## Structure du projet

```
cypress/
  config/       # un fichier JSON par environnement (recette, integration, preprod, prod)
  e2e/          # tests (*.cy.js)
  fixtures/     # jeux de données (JSON, CSV)
  support/      # e2e.js : plugins et commandes globales
  reports/      # rapports Mochawesome (généré)
cypress.config.js
package.json
allure-results/ # résultats Allure (généré)
allure-report/  # rapport Allure HTML (généré)
```

## Lancer les tests

```bash
# Mode interactif
npx cypress open

# Mode CLI (tous les tests)
npx cypress run --browser chrome

# Un test précis
npx cypress run --spec "cypress/e2e/login.cy.js" --browser chrome
```

> Sans `--browser`, Cypress utilise Electron, qui est déprécié et affiche un avertissement.

## Environnements

Chaque environnement a son fichier dans `cypress/config/` (qui définit le `baseUrl`).
On choisit l'environnement avec `--env configFile=...` (**recette** par défaut).

```bash
npx cypress run --env configFile=recette
npx cypress run --env configFile=integration
npx cypress run --env configFile=preprod
npx cypress run --env configFile=prod
```

> Les URL d'`integration` et de `preprod` sont des exemples : à remplacer par les vraies URL.

### Variables publiques : `Cypress.expose()`

Dans Cypress 16, `Cypress.env()` n'existe plus. Une valeur publique se lit avec `Cypress.expose()` et se passe avec `--expose` :

```js
const environment = Cypress.expose("var")
```

```bash
npx cypress run --spec "cypress/e2e/loginEnv.cy.js" --expose var=prod
```

Pour une valeur sensible (mot de passe, clé d'API), utiliser `cy.env()` :

```js
cy.env(["apiKey"]).then(({ apiKey }) => { /* ... */ })
```

## Tags (`@cypress/grep`)

Taguer un test :

```js
it("login valide", { tags: ["@smoke", "@regression"] }, () => { /* ... */ })
```

Lancer par tag (avec `--expose`, pas `--env`) :

```bash
npx cypress run --expose grepTags=@smoke
npx cypress run --env configFile=prod --expose grepTags=@smoke
```

> `@cypress/grep` doit être en version 6 ou plus.

## Jeux de données

Les fichiers sont dans `cypress/fixtures/` : un JSON de liste d'utilisateurs et un CSV.
Les tests correspondants se trouvent dans `cypress/e2e/` : `loginjson.cy.js`,
`loginjddWrap.cy.js`, `logincsv.cy.js` et `loginPapaparse.cy.js`.

## Rapports

### Mochawesome

```bash
npx cypress run --browser chrome
npm run report:merge       # fusionne les JSON -> cypress/reports/report.json
npm run report:generate    # génère cypress/reports/report.html
```

### Allure

```bash
npx cypress run --browser chrome
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

> Le plugin `@shelex/cypress-allure-plugin` n'est pas compatible avec Cypress 16
> (il utilise `Cypress.env()`). Ce projet utilise `allure-cypress`.
> Vérifier que `allure-results/` contient bien des fichiers après l'exécution.

## Scripts npm conseillés

À ajouter dans `package.json` :

```json
"scripts": {
  "cy:open": "cypress open",
  "cy:run": "cypress run --browser chrome",
  "test:recette": "cypress run --browser chrome --env configFile=recette",
  "test:preprod": "cypress run --browser chrome --env configFile=preprod",
  "test:prod": "cypress run --browser chrome --env configFile=prod",
  "test:smoke": "cypress run --browser chrome --expose grepTags=@smoke",
  "report:merge": "mochawesome-merge cypress/reports/mochawesome/*.json > cypress/reports/report.json",
  "report:generate": "marge cypress/reports/report.json -f report -o cypress/reports",
  "allure:generate": "allure generate allure-results --clean -o allure-report",
  "allure:open": "allure open allure-report"
}
```

## `.gitignore` conseillé

```
node_modules/
cypress/reports/
cypress/screenshots/
cypress/videos/
allure-results/
allure-report/
```

## Dépannage rapide

| Symptôme | Solution |
|---|---|
| Tous les tests tournent malgré `grepTags` | Utiliser `--expose` (pas `--env`) et `@cypress/grep` version 6 ou plus |
| `Cannot find module './cypress/config/xxx.json'` | Vérifier la valeur de `configFile=` et le dossier `cypress/config/` |
| `Package path ./commands is not exported from package allure-cypress` | Dans `cypress/support/e2e.js`, écrire `import "allure-cypress"` |
| `allure-results/` vide ou absent | Vérifier que `allureCypress(...)` est appelé avant le `return config` |
| Erreur sur `Cypress.env` | Remplacer par `Cypress.expose()` ou `cy.env()` |
| `npm error 404 ... allure-commandlinenpm` | Une commande npm a été collée deux fois : la relancer une seule fois |

## Règle importante dans `cypress.config.js`

Dans `setupNodeEvents`, tout ce qui suit un `return` n'est jamais exécuté. Il faut un **seul**
`return config`, à la toute fin, après avoir branché les plugins (environnement, tags, Allure).