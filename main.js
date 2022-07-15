require('dotenv').config();

const { Client, Collection, Intents, CommandInteractionOptionResolver, Message, DiscordAPIError } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.GUILD_MESSAGES, Intents.GUILDS] });
const Discord = require('discord.js');

//Discord token
client.login(process.env.TOKEN);

const ytdl = require("ytdl-core");


//shows when bot is running
client.on('ready', () => {
    console.log('Bot is ready')
})

//commands folder
client.commands = new Collection();
const fs = require("fs");
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

//set prefix for commands
const prefix = '!';




//Music bot
client.on('message', (message) => {
    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'clear') {
        client.commands.get('clear').execute(message, args);
    } else if (command === 'play') {
        client.commands.get('play').execute(message, args);
    } else if (command === 'stop') {
        client.commands.get('stop').execute(message, args);
    }
});