const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps-vs-bot')
		.setDescription('Let\'s play Rock - Paper - Scissors vs Bot')
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
        const choices = ['rock', 'paper', 'scissors']
        
        const playerChoice = interaction.options.getString('choice')
        const botChoice = choices[Math.floor(Math.random() * choices.length)]

        let result
        if(playerChoice === botChoice) {
            result = '🤝 Draw!'
        } else if (
            (playerChoice === 'rock' && botChoice === 'scissors') ||
            (playerChoice === 'scissors' && botChoice === 'paper') ||
            (playerChoice === 'paper' && botChoice === 'rock')
        ) {
            result = '🎉 You win!'
        } else {
            result = '😢 You lose!'
        }

        await interaction.reply(`Your choice: **${playerChoice}**\nBot choice: **${botChoice}**\n\n${result}`)

        // const exampleEmbed = new EmbedBuilder()
        //     .setColor(0x0099FF)
        //     .setTitle('Some title')
        //     .setURL('https://discord.js.org/')
        //     .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        //     .setDescription('Some description here')
        //     .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        //     .addFields(
        //         { name: 'Regular field title', value: 'Some value here' },
        //         { name: '\u200B', value: '\u200B' },
        //         { name: 'Inline field title', value: 'Some value here', inline: true },
        //         { name: 'Inline field title', value: 'Some value here', inline: true },
        //     )
        //     .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        //     .setImage('https://i.imgur.com/AfFp7pu.png')
        //     .setTimestamp()
        //     .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        // interaction.reply({ embeds: [exampleEmbed] });
	},
};