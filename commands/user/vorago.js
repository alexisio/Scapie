var Discord = require('discord.js'),
    utilities = require('./../../utils');

function Vorago() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!vorago [<lookupDate>]';
    this.examples = ['!vorago', '!vorago 10/10/2020']
    this.alias = ['rago'];
    this.description = 'Get the Vorago rotation for today or specified day';
    this.type = 'rotation';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/scapers/rotations/vorago';
            var future = false;
            if (suffix.trim().length > 1) {
                future = true;
                apiRequest += '/' + suffix.trim().replace(/\//g, '-');
            }
            console.log(apiRequest);

            utilities.request.api(apiRequest).then(function (rotations) {
                resolve({command: 'vorago', value: format(bot, rotations, future), sendType: utilities.sendType.EMBED});
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    var format = function (bot, data, future) {
        var embed = new Discord.RichEmbed();
        var rotation = data[0];
        var next = data[1];

        embed.setAuthor('Vorago', 'http://vignette3.wikia.nocookie.net/runescape2/images/1/18/Vorago_chathead.png', '')

        var normalData = utilities.markdown.bold(rotation.rotation.normal);
        if (!future) {
            var s = utilities.dateToString(new Date(next.startDate));
            normalData += ' until reset on ' + utilities.markdown.bold(s) + linebreak +
                utilities.markdown.bold(next.rotation.normal) + ' will follow';
        }
        else {
            var s = utilities.dateToString(new Date(rotation.startDate));
            normalData += ' starts on ' + utilities.markdown.bold(s);
        }
        embed.addField(utilities.markdown.bold('Rotation'), normalData);

        var hmData = 'East: ' + utilities.markdown.bold(rotation.rotation.hard.east) + linebreak
            + 'West: ' + utilities.markdown.bold(rotation.rotation.hard.west) + linebreak
            + 'Unlock: ' + utilities.markdown.bold(rotation.rotation.hard.unlock);
        embed.addField(utilities.markdown.bold('Hardmode'), hmData);

        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        embed.setThumbnail('http://vignette3.wikia.nocookie.net/runescape2/images/e/eb/Vorago.png/revision/latest/scale-to-width-down/150?cb=20130705143815');

        return embed;
    };

    var msToHMS = function(ms) {
        var seconds=Math.floor((ms/1000)%60);
        var minutes=Math.floor((ms/(1000*60))%60);
        var hours=Math.floor((ms/(1000*60*60))%24);
        return {hours: hours, minutes: minutes, seconds: seconds};
    }
}

module.exports = new Vorago();
