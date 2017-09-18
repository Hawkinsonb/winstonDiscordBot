const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const commands = require ('./commands.js');

var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

const bot_controller = config.bot_controller;
const prefix = config.prefix;
const discord_token = config.discord_token;

var voiceChannel = null;

client.login(discord_token);

client.on('message', function (message) {
    const member = message.member;
    const mess = message.content.toLocaleLowerCase();

    if(mess.startsWith(prefix + "join")) {
        message.reply("Right away sir!");
        voiceChannel = message.member.voiceChannel;
        console.log("Joining Channel: " + voiceChannel);
        voiceChannel.join();
    } else if(mess.startsWith(prefix + "leave")) {
        message.reply("Goodbye!");
        console.log("Leaving Channel: " + voiceChannel);
        if (voiceChannel) {
            message.content = "!Stop";
            commands.messageHandler(client, voiceChannel, message);
            voiceChannel.leave();
        }
    } else if(mess.startsWith(prefix + "help")) {
        message.reply("Here are the list of commands: !join, !leave, !play, !pause, !resume, !skip, !stop");  
    } else {
        commands.messageHandler(client, voiceChannel, message, prefix);
    }
});

client.on('ready', function() {
    console.log("Winston Connected");
});