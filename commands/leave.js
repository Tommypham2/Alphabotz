module.exports = {
    name: 'leave',
    description: 'stops the bot and leaves channel',
    async execute(message, args){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send('You need to be in the channel to stop music.')
        await voiceChannel.leave();
        await message.channel.send('Leaving Channel!')
    }
}