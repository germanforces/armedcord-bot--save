require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const { clienttoken, clientid } = process.env

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync("./src/commands");
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter(file => file.endsWith(".js"));


            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON())
                console.log(`Command ${command.data.name} has been passed the handler`)
            }
        }

        const rest = new REST({ version: '10' }).setToken(clienttoken);
        try {
            console.log("Started refreshing application (/) commands.");

            await rest.put(
                Routes.applicationCommands(clientid),
                {
                    body: client.commandArray,
                });

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }

    }
}