var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function SetRSN() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!verify [displayName]';
    this.examples = ['!verify sync'];
    this.alias = [];
    this.description = 'Verify your RSN for Scapie.';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var player = {
                display: suffix.trim(),
                discordId: message.author.id
            };
            utilities.request.api('/api/scapers/players/verify/' + player.display + '/' + player.discordId, utilities.httpMethod.POST).then(function (player) {
                resolve({command: 'verify', value: format(player), sendType: utilities.sendType.EMBED});
            }).catch(function (err) {
                reject({command: 'news', value: 'Unable to set RSN', sendType: utilities.sendType.STRING});
            });
        });
    };

    var format = function (player) {
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Verifying RSN', '');
        embed.setDescription('Verification step was successful')
        if (typeof player.message == 'undefined') {
            if (player.isVerified) {
                embed.addField('Verification Process', 'The process is complete! If you update your RSN, you will have to do a lesser version of this same process.');
            }
            else {
                embed.addField('Verification Process', 'The next world that ' + utilities.markdown.bold(utilities.toTitle(player.display)) + ' needs to log in to is '
                    + utilities.markdown.bold(player.verificationWorld) + '\n\n' + 'Step: ' + utilities.markdown.bold(player.verificationCount) + ' ' + utilities.markdown.bold('of 3'));
            }

        }
        else {
            embed.setDescription(player.message);
        }
        return embed;
    }
}

module.exports = new SetRSN();
