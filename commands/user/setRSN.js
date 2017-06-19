var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function SetRSN() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!setrsn [displayName]';
    this.examples = ['!setrsn sync'];
    this.alias = [];
    this.description = 'Set your RSN for Scapie. Also can update RSN with this command.';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var newName;
            var display = suffix.trim();
            var update = false;
            if (suffix.includes('>')) {
                var sepIndex = suffix.indexOf('>');
                display = suffix.substring(0, sepIndex).trim();
                newName = suffix.substring(sepIndex + 1, suffix.length).trim();
                update = true;
            }
            var player = {
                display: display.trim(),
                discordId: message.author.id
            };
            if (!update) {
                utilities.request.api('/api/scapers/players', utilities.httpMethod.POST, player).then(function (player) {
                    resolve({command: 'setrsn', value: format(player), sendType: utilities.sendType.EMBED});
                }).catch(function (err) {
                    reject({command: 'news', value: 'Unable to set RSN', sendType: utilities.sendType.STRING});
                });
            }
            else {
                utilities.request.api('/api/scapers/players/change/' + display + '/' + newName, utilities.httpMethod.PUT).then(function (player) {
                    resolve({command: 'setrsn', value: format(player, update), sendType: utilities.sendType.EMBED});
                }).catch(function (err) {
                    reject({command: 'news', value: 'Unable to set RSN', sendType: utilities.sendType.STRING});
                });
            }
        });
    };

    var format = function(player, update) {
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Setting RSN', '');
        embed.setDescription('Your RSN is now associated with your Discord account, however, you are not the verified linked owner of the RSN. To do this, you will need to verify that you are the owner by completing 3 world hops to designated worlds. Your private chat must be set to ON to allow the lookup to be completed.')
        if (update) {
            embed.setAuthor('Updating RSN','')
            embed.setDescription('RSN was successfully updated to: ' + utilities.markdown.bold(player.display));
        }
        if (typeof player.message == 'undefined') {
            embed.addField('Verification Process', utilities.markdown.bold(utilities.toTitle(player.display)) + ' needs to log in to world ' + utilities.markdown.bold(player.verificationWorld) + ' to verify ownership.' +
                '\n\n' + 'Step: ' + utilities.markdown.bold(player.verificationCount) + ' ' + utilities.markdown.bold('of 3'));
        }
        else {
            if (typeof player.verified !== 'undefined' && !player.verified) {
                embed.addField('Verification Process', utilities.markdown.bold(utilities.toTitle(player.player.display)) + ' needs to log in to world ' + utilities.markdown.bold(player.player.verificationWorld) + ' to verify ownership.');
            }
            else {
                embed.setDescription(player.message);
            }
        }
        return embed;
    }
}

module.exports = new SetRSN();
