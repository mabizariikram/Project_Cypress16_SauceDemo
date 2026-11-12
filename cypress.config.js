const { defineConfig } = require("cypress")
const { allureCypress } = require("allure-cypress/reporter")

module.exports = defineConfig({
  // reporter Mochawesome (gardez-le si vous voulez les deux rapports)
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    overwrite: false,
    html: false,
    json: true,
  },

  e2e: {
    
    video: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",

    setupNodeEvents(on, config) {
      // 1. environnement
      const envName = config.env.configFile || "recette"
      const envConfig = require(`./cypress/config/${envName}.json`)
      config = { ...config, ...envConfig }

      // 2. tags
      const { plugin: cypressGrepPlugin } = require("@cypress/grep/plugin")
      cypressGrepPlugin(config)

      // 3. allure
      allureCypress(on, config, {
        resultsDir: "./allure-results",
      })

      return config
    },
  },
})