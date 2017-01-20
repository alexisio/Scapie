var Discord = require('discord.js'),
    utilities = require('./../../utils');

function Spotlight() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!spotlight [<lookupDate> or <lookupMinigame>]';
    this.examples = ['!araxxor', '!araxxor 10/10/2020']
    this.alias = ['minigame', 'minigames'];
    this.description = 'Get the spotlight for today or specified day or the next instance of a specified minigame being active';
    this.type = 'rotation';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/scapers/rotations/spotlight';
            var future = false;
            var specific = false;
            if (suffix.trim().length > 1) {
                suffix = suffix.trim().replace(/\//g, '-');
                if (suffix.includes('-')) {
                    future = true;
                    apiRequest += '/' + suffix;
                }
                else {
                    specific = true;
                    var val = typeof minigameAlias[suffix] !== 'undefined' ? minigameAlias[suffix] : suffix;
                    apiRequest += '/minigame/' + val.replace(/ /g, '%20');
                }
            }
            console.log(apiRequest);
            utilities.request.api(apiRequest).then(function (rotations) {
                resolve({
                    command: 'spotlight',
                    value: format(bot, rotations, future, specific),
                    sendType: utilities.sendType.EMBED
                });
            }).catch(function (err) {
                reject({command: 'spotlight', value: 'Unable to find spotlight', sendType: utilities.sendType.STRING});
                reject({command: 'spotlight', value: 'Unable to find spotlight', sendType: utilities.sendType.STRING});
            });
        });
    };

    var format = function (bot, data, future, specific) {
        var embed = new Discord.RichEmbed();
        var current = typeof data[0] !== 'undefined'? data[0] : data;
        var next = data[1];
        embed.setAuthor('Spotlight', 'http://vignette4.wikia.nocookie.net/runescape2/images/a/a8/Thaler.png/revision/latest?cb=20150518122432', '');
        embed.setThumbnail('http://vignette3.wikia.nocookie.net/runescape2/images/2/26/Stanley_Limelight_chathead.png/revision/latest?cb=20150518185301');
        var currentData = utilities.markdown.bold(current.rotation);
        if (!future && ! specific) {
            var s = utilities.dateToString(new Date(next.startDate));
            currentData += ' will be on Spotlight until reset on ' + utilities.markdown.bold(s) + linebreak +
                utilities.markdown.bold(next.rotation) + ' will follow';
            embed.addField(utilities.markdown.bold('Rotation'), currentData, true);
        }
        else if (future) {
            currentData += ' will be on Spotlight';
            embed.addField(utilities.markdown.bold('Rotation'), currentData, true);
        }
        else {
            var s = utilities.dateToString(new Date(current.startDate));
            currentData += ' will be on Spotlight at reset on ' + utilities.markdown.bold(s);
            embed.addField(utilities.markdown.bold('Rotation'), currentData, true);
        }

        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');

        return embed;
    };

    var minigameAlias = {
        'pc': 'pest control',
        'sw': 'soul wars',
        'fog': 'fist of guthix',
        'ba': 'barbarian assault',
        'con': 'conquest',
        'ft': 'fishing trawler',
        'gop': 'great orb project',
        'cw': 'castle wars',
        'sc': 'stealing creation',
        'cfb': 'cabbage facepunch bonanza',
        'heist': 'heist',
        'ma': 'mobilising armies',
        'tb': 'trouble brewing'
    };

}

module.exports = new Spotlight();
