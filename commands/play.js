const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { MessageEmbed } = require('discord.js');

const queue = new Map();

module.exports = {
    name: 'play',
    description: 'Joins and plays video from youtube',
    queues: {},
    voiceConnections:{},
    async execute(message, args) {

        
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send('Join a channel to play a song');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send('You dont have permission to use this function');
        if(!permissions.has('SPEAK')) return message.channel.send('You dont have permission to use this function');
        if(!args.length) return message.channel.send('You need to send a second argument');


        const serverQueue = queue.get(message.guild.id);

        let song = [];

        //Set up play function for link
        const validURL = (str) =>{
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex.test(str)){
                return false;
            } else {
                return true;
            }
        }

        if(validURL(args[0])){
            const song_info = await validURL(args[0]);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}

        } else {
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
    
                return (videoResult.videos.length > 1)? videoResult.videos[0] : null;
            }
            const video = await videoFinder(args.join(' '));
            if(video){
                song = { title: video.title, url: video.url}
            } else {
                message.channel.send('Error finding video');
            }
        }

        if(!serverQueue){
            const queueConstructor = {
                voiceChannel: voiceChannel,
                textChannel: message.channel,
                connection: null,
                songs: []
            }

            queue.set(message.guild.id, queueConstructor);
            queueConstructor.songs.push(song);

            try {
                const connection = await voiceChannel.join();
                queueConstructor.connection = connection;
                videoPlayer(message.guild, queueConstructor.songs[0]);
            } catch (err){
                queue.delete(message.guild.id)
                message.channel.send('There was an error connecting!');
                throw err;
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** added to queue`);
        }
    }
        
}

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if(!song){
        songQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {filter: 'audioonly'});
    songQueue.connection.play(stream, { seek:0,volume: 0.5})
    .on('finish', () =>{
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });
    await songQueue.textChannel.send(`Now playing **${song.title}**${song.url}`)
}

const skipSong = (message, serverQueue) => {
    if(!message.member.voice.channel) return message.channel.send('You need to be in the channel to skip queued songs!');
    if(!serverQueue){
        return message.channel.send('There are no songs queued to skip!');
    }
    serverQueue.connection.dispatcher.end();

}