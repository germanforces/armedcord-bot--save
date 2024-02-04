const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        setInterval(client.pickPresence, 10 * 3000);
        console.log("Ready! Client logged in.")

    }
}