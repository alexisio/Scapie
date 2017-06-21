var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../../utils/index');

function SetRSN() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!set <type> [displayName]';
    this.examples = ['!set rsn sync', '!set clan maximized'];
    this.alias = [];
    this.description = 'Set your RSN or link your Discord guild to your Clan for Scapie. Also can update RSN or Clan name with this command.';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var newMain;
            var cmd = suffix.trim().split(' ')[0];
            var main;
            suffix = suffix.trim().substring(cmd.length, suffix.length);
            main = suffix.trim();
            var update = false;
            if (suffix.includes('>')) {
                var sepIndex = suffix.indexOf('>');
                main = suffix.substring(0, sepIndex).trim();
                newMain = suffix.substring(sepIndex + 1, suffix.length).trim();
                update = true;
            }
            var player = {
                display: main.trim(),
                discordId: message.author.id
            };
            console.log(player);
            switch (cmd.toLowerCase()) {
                case 'rsn':
                    if (!update) {
                        utilities.request.api('/api/scapers/players', utilities.httpMethod.POST, player).then(function (player) {
                            resolve({command: 'set rsn', value: formatRSN(player), sendType: utilities.sendType.EMBED});
                        }).catch(function (err) {
                            reject({
                                command: 'set rsn',
                                value: 'Unable to set RSN',
                                sendType: utilities.sendType.STRING
                            });
                        });
                    }
                    else {
                        utilities.request.api('/api/scapers/players/change/' + main + '/' + newMain, utilities.httpMethod.PUT).then(function (player) {
                            resolve({
                                command: 'set rsn',
                                value: formatRSN(player, update),
                                sendType: utilities.sendType.EMBED
                            });
                        }).catch(function (err) {
                            reject({
                                command: 'set rsn',
                                value: 'Unable to set RSN',
                                sendType: utilities.sendType.STRING
                            });
                        });
                    }
                    break;
                case 'clan':
                    var a = '/api/scapers/clans/' + main + '/verify/' + player.discordId + '/' + message.guild.id;
                    console.log('clan', a);
                    utilities.request.api(a, utilities.httpMethod.PUT).then(function (clan) {
                        resolve({
                            command: 'set clan',
                            value: formatClan(clan, message.guild),
                            sendType: utilities.sendType.EMBED
                        });
                    }).catch(function (err) {
                        reject({command: 'set clan', value: 'Unable to set RSN', sendType: utilities.sendType.STRING});
                    });
                    break;
            }
        });
    };

    var formatClan = function (clan, guild) {
        console.log(clan);
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Setting Clan', '');
        if (typeof clan.message == 'undefined') {
            embed.setDescription(utilities.toTitle(utilities.markdown.bold(clan.name)) + ' is now owned and set to the Discord guild: ' + utilities.markdown.bold(guild.name));
        }
        else {
            embed.setDescription(clan.message);
        }
        utilities.request.api('/api/scapers/players/stats/guild/' + guild.id, utilities.httpMethod.PUT).then(function(stats) {
           console.log('got stats', stats[0]);
        });
        console.log('returning');
        return embed;
    };

    var formatRSN = function (player, update) {
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Setting RSN', '');
        embed.setDescription('Your RSN is now associated with your Discord account, however, you are not the verified linked owner of the RSN. To do this, you will need to verify that you are the owner by completing 3 world hops to designated worlds. Your private chat must be set to ON to allow the lookup to be completed.')
        if (update) {
            embed.setAuthor('Updating RSN', '')
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
