const player = require('./player.js');
const fs = require("fs");

var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

const prefix = config.prefix;


module.exports = {
    messageHandler: function(client, voiceChannel, message){
        const member = message.member;
        const mess = message.content.toLocaleLowerCase();
        const args = message.content.split(' ').slice(1).join(" ");

        if (mess.startsWith(prefix + "play")) {
            console.log("Command: Play");
            player.play(client, voiceChannel, message);
        } else if (mess.startsWith(prefix + "pause")) {
            console.log("pause");
            player.pause();
        } else if (mess.startsWith(prefix + "resume")) {
            console.log("resume");
            player.resume();
        } else if (mess.startsWith(prefix + "skip")) {
            console.log("Command: skip");
        } else if (mess.startsWith(prefix + "stop")) {
            console.log("Command: stop");
        } else {
            console.log("invalid command handled");
        }
    }
}