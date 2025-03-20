module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                }
            }
        } else if(interaction.isButton()) {
            const customId = interaction.customId;
    
            if (customId.startsWith('rpsAccept_') || customId.startsWith('rpsChoice_')) {
                const rpsCommand = interaction.client.commands.get('rps-vs-player');
                if (rpsCommand && rpsCommand.buttonInteraction) {
                    await rpsCommand.buttonInteraction(interaction);
                }
            }
        }
    }
}