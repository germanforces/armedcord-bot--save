require("dotenv").config();
const { clienttoken, databasetoken } = process.env
const { connect } = require("mongoose");
const {
    Client,
    GatewayIntentBits,
    Collection,
    Partials,

} = require("discord.js")
const fs = require("fs")

const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
        ],

        partials: [
            Partials.Message,
            Partials.Channel,
            Partials.GuildMember,
            Partials.GuildScheduledEvent,
            Partials.User,
        ],

    }
);

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.cooldowns = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
    const functionsFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter(file => file.endsWith(".js"));
    for (const file of functionsFiles)
        require(`./functions/${folder}/${file}`)(client)
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(clienttoken);
(async () => {
    await connect(databasetoken).catch(console.error);
})();