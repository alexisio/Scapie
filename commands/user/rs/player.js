var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../../utils/index');

function Player() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!player <username>';
    this.examples = ['!player Sync'];
    this.alias = [];
    this.description = 'Get a user\'s player details';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        var lookup;
        var name = suffix.trim();
        if (suffix.includes('#')) {
            var sepIndex = suffix.indexOf('#');
            name = suffix.substring(0, sepIndex).trim();
            lookup = suffix.substring(sepIndex + 1, suffix.length).trim();
        }
        name = name.replace(/ /g, '%20')
        return new Promise(function (resolve, reject) {
            utilities.request.api('/api/rs/player/details/' + name).then(function (details) {
                resolve({command: 'player', value: format(bot, details), sendType: utilities.sendType.EMBED});
            }).catch(function (err) {
                reject({command: 'player', value: 'Unable to find user\'s player details', sendType: utilities.sendType.STRING});
            });
        });
    };

    var format = function (bot, data) {
        var player = data[0];
        var username = utilities.toTitle(player.name.trim());
        var nameWithTitle = player.isSuffix ? username + ' ' + player.title : player.title + ' ' + username;
        var embed = new Discord.RichEmbed();

        embed.setAuthor(nameWithTitle,'','https://apps.runescape.com/runemetrics/app/overview/player/' + username.trim().replace(/ /g, '%20'));

        var online = player.online ? player.world : 'Offline';
        embed.addField(utilities.markdown.bold('Ingame Status'), online, true);
        embed.addField(utilities.markdown.bold('Clan'), player.clan, true);

        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        var ava = 'https://secure.runescape.com/m=avatar-rs/' + username.trim().replace(/ /g, '%20') + '/chat.png'
        console.log(ava);
        embed.setThumbnail(ava);
        return embed;
    };

}

module.exports = new Player();
