const ytdl = require("ytdl-core");
const request = require("request");
const getYouTubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const fs = require("fs");

var queue = [];
var isPlaying = false;
var dispatcher = null;
var client = null;
var voiceChannel = null;

var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

const youTube_api_key = config.youTube_api_key;

module.exports = {
    play: function(dClient, dVoiceChannel, message) {
        client = dClient;
        voiceChannel = dVoiceChannel;
        const args = message.content.split(' ').slice(1).join(" ");
        
        if (voiceChannel) {
            getID(args, function(id) {
                add_to_queue(id);
                if(!isPlaying) {
                    isPlaying = true;
                    fetchVideoInfo(id, function (err, videoInfo) {
                        if(err) throw new Error(err);
                        message.reply(" Playing: **" + videoInfo.title + "**");
                    });
                    playMusic(queue, message);
                } else {
                    fetchVideoInfo(id, function (err, videoInfo) {
                        if(err) throw new Error(err);
                        message.reply(" Added to queue: **" + videoInfo.title + "**");
                    });
                }
            });
        }
    },
    pause: function() {
        if(dispatcher){
            dispatcher.pause();
        }
    },
    resume: function() {
        dispatcher.resume();
    },
}

function playMusic(queue, message) {
    console.log(queue);
    id = queue.shift();
    stream = ytdl("https://wwww.youtube.com/watch?v=" + id, {
        filter: 'audioonly'
    });

    if(voiceChannel) {
        dispatcher = voiceChannel.connection.playStream(stream);
    }else {
        message.reply("Oops, I need to !join your voice channel fisrt");
    }

    dispatcher.on('end', function() {
        console.log("dispatcher end")
        if (queue.length === 0) {
            queue = [];
            isPlaying = false;
        } else {
            playMusic(queue, message);
        }
    })
}

function getID(arg, cb) {
    console.log(arg);
    if (isYoutube(arg)) {
        console.log("isYoutube link");
        cb(getYouTubeID(arg));
    } else {
        console.log("Searching for the video");
        search_video(arg, function(id) {
            cb(id);
        });
    }
};

function add_to_queue(argID) {
    if(isYoutube(argID)) {
        console.log("Getting YouTubeID: " + argID);
        queue.push(getYouTubeID(argID));
    } else {
        console.log("Pushing Arg ID: " + argID);
        queue.push(argID);
    }
}

function search_video(query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + youTube_api_key, function(error,response,body) {
        var json = JSON.parse(body);
        callback(json.items[0].id.videoId);
    });
}

function isYoutube(arg) {
    console.log("isYoutube: " + arg)
    return arg.toLocaleLowerCase().indexOf("youtube.com") > -1;
}
