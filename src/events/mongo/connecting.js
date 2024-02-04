const chalk = require("chalk");

module.exports = {
    name: "disconnected",
    execute(err) {
        console.log(
            chalk.red("Database status is disconnected.")
        )
    }
}