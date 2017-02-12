var Discord = require('discord.js'),
    utilities = require('./../../utils');

function Portables() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!portables';
    this.examples = ['!portables']
    this.alias = [];
    this.description = 'Get most recent Portables FC call';
    this.type = 'skilling';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/scapers/skilling/portables';
            utilities.request.api(apiRequest).then(function (portables) {
                resolve({command: 'portables', value: format(bot, portables), sendType: utilities.sendType.EMBED});
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    var format = function (bot, data) {
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Portables', 'http://vignette1.wikia.nocookie.net/runescape2/images/2/2b/Portable_skilling_pack_detail.png/revision/latest?cb=20150220002222', '');
        embed.setThumbnail('https://pbs.twimg.com/profile_images/773927684132970496/VUgCCtBY.jpg');
        var calls = '';
        for (var type in data) {
            if (type !== 'abbrev' && type !== 'update') {
                calls += utilities.markdown.bold(utilities.toTitle(type) + ': ') + data[type] + linebreak;
            }
        }
        embed.addField(utilities.markdown.bold('Locations'), calls, true);
        embed.addField(utilities.markdown.bold('Abbreviations'), data.abbrev.replace(/\| /g, '\n').trim(), true);
        embed.setFooter('Scapie - Last Update: ' + data.update.update + ' by ' + data.update.updateBy, 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        return embed;
    };
}

module.exports = new Portables();
