require('dotenv').config();



const { Client, Collection, Intents, CommandInteractionOptionResolver, Message, DiscordAPIError } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
//Discord token

client.login(process.env.TOKEN);

const ytdl = require("ytdl-core");


//set prefix for commands
const prefix = '!';



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

//Music bot
client.on('messageCreate', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if(command === 'clear') {
        client.commands.get('clear').execute(message, args);
    } else if (command === 'play') {
        client.commands.get('play').execute(message,args);
    } else if (command === 'leave') {
        client.commands.get('leave').execute(message, args);
    }
});