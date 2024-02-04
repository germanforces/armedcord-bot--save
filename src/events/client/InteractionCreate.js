const { InteractionType, Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);

            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: `Something went wrong while execute this command.`,
                    ephemeral: true
                })
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);

            if (!button) return;

            try {
                await button.execute(interaction, client);
            } catch (err) {
                console.log(err);
            }
        } else if (interaction.isStringSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId);

            if (!menu) return

            try {
                await menu.execute(interaction, client);
            } catch (error) {
                console.log(error)
            }
        } else if (interaction.isContextMenuCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const contextCommand = commands.get(commandName);

            if (!contextCommand) return;

            try {
                await contextCommand.execute(interaction, client)

            } catch (error) {
                console.log(error)
            }
        } else if (interaction.type == InteractionType.ModalSubmit) {
            const { modals } = client;
            const { customId } = interaction;
            const modal = modals.get(customId)
            if (!modal) return;

            try {
                await modal.execute(interaction, client);
            } catch (error) {
                console.error(error)
            }
        } else {
            const { commands } = client;
            const { commandName } = interaction;
            const { cooldowns } = interaction.client;

            if (!cooldowns.has(commandName)) {
                cooldowns.set(commandName, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(commandName);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (commands.cooldown ?? defaultCooldownDuration) * 1_000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({ content: `Please wait, you are on a cooldown for \`${commandName}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);


        }
    }
}