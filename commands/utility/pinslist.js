const { SlashCommandBuilder, ChannelType } = require("discord.js");
const ellipsis = require('text-ellipsis');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pins')
        .setDescription('List all current pins')
        .addChannelOption((option) =>
            option.setName('oldchannel')
                .setDescription('The channel to pull pins from')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .addChannelOption((option) => 
            option.setName('newchannel')
            .setDescription('The channel to make new threads')
            .addChannelTypes(ChannelType.GuildForum)
            .setRequired(true)),

    async execute(interaction) {
        let oldChannel = await interaction.options.getChannel('oldchannel');
        let newChannel = await interaction.options.getChannel('newchannel');
        newChannel = await newChannel.fetch();
        oldChannel = await oldChannel.fetch();
        const pinnedMessages = await oldChannel.messages.fetchPinned();
        for (const msg of Array.from(pinnedMessages.values())) {
            var name = ellipsis(msg.content, 90);
            const thread = await newChannel.threads.create({
                name: name,
                reason: 'Imported from old pins',
                message: `Originally posted by ${msg.author.toString()}
Original Date: ${msg.createdAt.toDateString() }
Original Discussion: ${msg.url}

Full Message content below:

${msg.content}`

            });
        }
        
    }
}

