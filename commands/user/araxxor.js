var Discord = require('discord.js'),
    utilities = require('./../../utils');

function Araxxor() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!araxxor [<lookupDate>]';
    this.examples = ['!araxxor', '!araxxor 10/10/2020']
    this.alias = ['rax'];
    this.description = 'Get the Araxxor rotation for today or specified day';
    this.type = 'rotation';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/scapers/rotations/araxxor';
            var future = false;
            if (suffix.trim().length > 1) {
                future = true;
                apiRequest += '/' + suffix.trim().replace(/\//g, '-');
            }

            utilities.request.api(apiRequest).then(function (rotations) {
                resolve({
                    command: 'araxxor',
                    value: format(bot, rotations, future),
                    sendType: utilities.sendType.EMBED
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    var format = function (bot, data, future) {
        var embed = new Discord.RichEmbed();
        var rotation = data[0];
        var next = data[1];
        var ava = 'http://vignette1.wikia.nocookie.net/runescape2/images/f/f2/Araxxor.png/revision/latest/scale-to-width-down/150?cb=20140729225744';

        embed.setAuthor('Araxxor', ava, '');
        var currentData = 'Open: ' + utilities.markdown.bold(rotation.rotation.open[0].characteristic) + ' and ' + utilities.markdown.bold(rotation.rotation.open[1].characteristic) + linebreak +
            'Closed: ' + utilities.markdown.bold(rotation.rotation.closed.characteristic);
        if (!future) {
            var s = utilities.dateToString(new Date(next.startDate));
            var nextStart = new Date(next.startDate);
            nextStart.setHours(0,0,0,0);
            var dhms = utilities.msToDHMS(Math.abs(nextStart - new Date()));
            currentData += linebreak + 'For: **' + dhms.days + 'd ' + dhms.hours + 'h ' + dhms.minutes + 'm ' + dhms.seconds + 's**';

            var nextData = 'Open: ' + utilities.markdown.bold(next.rotation.open[0].characteristic) + ' and ' + utilities.markdown.bold(next.rotation.open[1].characteristic) + linebreak +
                'Closed: ' + utilities.markdown.bold(next.rotation.closed.characteristic);

            embed.addField(utilities.markdown.bold('Current'), currentData);
            embed.addField(utilities.markdown.bold('Next'), nextData);
        }
        else {
            var s = utilities.dateToString(new Date(rotation.startDate));
            embed.addField(utilities.markdown.bold('Rotation on ' + s), currentData);
        }
        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        embed.setThumbnail(ava);

        return embed;
    };

    var msToDHMS = function(ms) {
        var seconds=Math.floor((ms/1000)%60);
        var minutes=Math.floor((ms/(1000*60))%60);
        var hours=Math.floor((ms/(1000*60*60))%24);
        var days = Math.floor((ms/1000) / (24*60*60));
        return {days: days, hours: hours, minutes: minutes, seconds: seconds};
    }
}

module.exports = new Araxxor();
