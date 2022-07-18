module.exports = {
    name: 'skip',
    description: 'skips songs in queue',
    async execute(message, args){
        const voiceChannel = message.member.voice.channel;

        const skipSong = (message, serverQueue) => {
            if(!message.member.voice.channel) return message.channel.send('You need to be in the channel to skip queued songs!');
            if(!serverQueue){
                return message.channel.send('There are no songs queued to skip!');
            }
            serverQueue.connection.dispatcher.end();

            if(message.content === !skip){
                skipSong(message, serverQueue)
            }
    }
}
}