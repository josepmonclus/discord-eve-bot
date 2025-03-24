const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const activeGames = new Map(); // Guardará las partidas activas

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps-vs-player')
		.setDescription('Create a new Rock - Paper - Scissors game vs other player')
        .addStringOption(option =>
            option.setName('choice')
                    .setDescription('Select your choice')
                    .setRequired(true)
                    .addChoices(
                        {name: 'Rock', value: 'rock'},
                        {name: 'Paper', value: 'paper'},
                        {name: 'Scissors', value: 'scissors'},
                    )
        ),
    async execute(interaction) {
        const player1 = interaction.user
        const player1Choice = interaction.options.getString('choice')

        // Create button to accept game
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`rpsAccept_${player1.id}`)
                .setLabel('Accept challenge')
                .setStyle(ButtonStyle.Success)
        )

        // Save game
        activeGames.set(player1.id, { player1, player1Choice, player2: null})

        await interaction.reply({
            content: `🔥 ${player1.username} has created a new rock, paper, schissors challenge!`,
            components: [row]
        })
    },
    async buttonInteraction(interaction) {
        const customId = interaction.customId
        if(customId.startsWith('rpsAccept_')) {
            const player1Id = customId.split('_')[1]
            const game = activeGames.get(player1Id)

            if(!game) return interaction.reply({ content: 'This challenge is no longer available', ephemeral: true })

            game.player2 = interaction.user

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`rpsChoice_rock_${player1Id}`).setLabel('🧱 Rock').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId(`rpsChoice_paper_${player1Id}`).setLabel('📄 Paper').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId(`rpsChoice_scissors_${player1Id}`).setLabel('✂️ Scissors').setStyle(ButtonStyle.Primary)
            )

            await interaction.update({
                content: `✅ **${game.player2.username}** has accepted **${game.player1.username}** challenge.\n\n${game.player2.username}, make your choice:`,
                components: [row]
            })

            activeGames.set(player1Id, game)
        }

        if(customId.startsWith('rpsChoice_')) {
            const [, player2Choice, player1Id] = customId.split('_')
            const game = activeGames.get(player1Id)

            if(!game || game.player2.id !== interaction.user.id) {
                return interaction.reply({
                    content: 'Invalid challenge or challenge no longer available',
                    ephemeral: true
                })
            }

            const {player1, player1Choice, player2} = game
            activeGames.delete(player1Id)

            // Resolve game
            let result
            if(player1Choice === player2Choice) {
                result = '🤝 Draw!'
            } else if(
                (player1Choice === 'rock' && player2Choice === 'scissors') ||
                (player1Choice === 'scissors' && player2Choice === 'paper') ||
                (player1Choice === 'paper' && player2Choice === 'rock')
            ) {
                result = `🎉 **${player1.username}**1 win!`
            } else {
                result = `🎉 **${player2.username}**2 win!`
            }

            console.log('------player 1------------')
            console.log(player1)
            console.log('------player 2-----------')
            console.log(player2)
            console.log('------INTERACTION------------')
            console.log(interaction)
            console.log('--------END------')

            await interaction.update({
                content: `**🧱📄✂️ Rock | Paper | Scissors**\n\n` +
                            `${player1.username} choice: **${player1Choice}**\n` +
                            `${player2.username} choice: **${player2Choice}**\n\n` +
                            `${result}`,
                components: []
            })
        }
    }
};