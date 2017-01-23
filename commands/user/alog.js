var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function Alog() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!alog <username>';
    this.examples = ['!alog Sync'];
    this.alias = [];
    this.description = 'Get a user\'s RuneMetrics event log';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        var lookup;
        var name = suffix.trim();
        if (suffix.includes(',')) {
            var sepIndex = suffix.indexOf(',');
            name = suffix.substring(0, sepIndex).trim();
            lookup = suffix.substring(sepIndex + 1, suffix.length).trim();
        }
        name = name.replace(/ /g, '%20')
        return new Promise(function (resolve, reject) {
            utilities.request.api('/api/rs/player/events/' + name).then(function (events) {
                console.log(events);
                resolve({command: 'alog', value: format(bot, events), sendType: utilities.sendType.EMBED});
            }).catch(function (err) {
                console.log(err);
                reject({command: 'alog', value: 'Unable to find user\'s event log', sendType: utilities.sendType.STRING});
            });
        });
    };

    var format = function (bot, data) {
        var embed = new Discord.RichEmbed();
        var items = data.items;
        embed.setAuthor('Events for ' + utilities.toTitle(data.username.trim()), 'http://vignette3.wikia.nocookie.net/runescape2/images/8/88/RuneMetrics_icon.png/revision/latest?cb=20160421161211', '')

        var firstSet = Math.floor(items.length * .25);

        var first = '';
        for (var i = 0; i < firstSet; i++) {
            var item = items[i];
            var desc = item.description.indexOf('levelled') >= 0 ? item.description : item.title;
            first += desc.replace('.', '') + ' on ' + utilities.markdown.italicize(utilities.dateToString(new Date(item.created))) + linebreak;
        }
        var second = '';
        for (var i = firstSet; i < items.length; i++) {
            var item = items[i];
            var desc = item.description.indexOf('levelled') >= 0 ? item.description : item.title;
            second += desc.replace('.', '') + ' on ' + utilities.markdown.italicize(utilities.dateToString(new Date(item.created))) + linebreak;
        }
        embed.addField(utilities.markdown.bold('Recent Achievements'), first);
        embed.addField(utilities.markdown.bold('Older'), second);

        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        var ava = 'https://secure.runescape.com/m=avatar-rs/' + data.username.trim().replace(/ /g, '%20') + '/chat.png';
        embed.setThumbnail(ava);
        return embed;
    };

}

module.exports = new Alog();
