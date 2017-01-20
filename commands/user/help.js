var Discord = require('discord.js'),
    utilities = require('./../../utils');

function Help(user, mod) {
    this.enabled = true;
    this.run = function (bot, msg, suffix) {
        return new Promise(function (resolve, reject) {
            resolve({command: 'help', value: getHelp(suffix), sendType: utilities.sendType.EMBED});
        });
    };

    this.alias = function () {
        return new Promise(function (resolve, reject) {
            resolve({value: getAliases()});
        });
    };

    var getHelp = function (suffix) {
        var help = {};
        for (var cmd in user) {
            var type = user[cmd].type;
            var cmdHelp = {
                name: cmd,
                usage: user[cmd].usage,
                alias: user[cmd].alias,
                examples: user[cmd].examples,
                description: user[cmd].description
            }
            if (typeof help[type] === 'undefined') {
                help[type] = [];
            }
            help[type].push(cmdHelp);
        }
        // create the embed
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Scapie Help', '', '');
        embed.setThumbnail('https://pbs.twimg.com/profile_images/773927684132970496/VUgCCtBY.jpg');
        for (var type in help) {
            var helpDisplay = '';
            var helpData = help[type];
            for (var i = 0; i < helpData.length; i++) {
                var h = helpData[i];
                var aliases = '';
                h.alias.forEach(function(a) { aliases += a + ', ' });
                helpDisplay += utilities.toTitle(h.name) + ' - ' + h.description + '\n' +
                    'Usage:   ' + h.usage +
                    (aliases.trim().length > 0 ? '\nAliases: ' + aliases.substring(0, aliases.length - 2).trim() : '')
                    + '\n\n';
            }
            embed.addField(utilities.markdown.bold(utilities.toTitle(type)), helpDisplay);
        }
        embed.setThumbnail('https://alexisio.github.io/Runescape/images/logos/ScapieOwlProfile.png');
        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        return embed;
    };

    this.getAliases = function () {
        var aliases = {};
        for (var cmd in user) {
            user[cmd].alias.forEach(function (alias) {
                aliases[alias] = cmd;
            });
        }
        return aliases;
    };
}

module.exports = Help;