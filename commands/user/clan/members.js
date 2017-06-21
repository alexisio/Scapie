var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../../utils/index');

function Members() {
    this.usage = '!members';
    this.examples = [];
    this.alias = [];
    this.description = 'Get your stats';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var clanLook;
            if (suffix.trim().length > 0) {
                clanLook = suffix.trim();
            }
            if (message.channel.type == 'text') {
                if (!clanLook) {
                    utilities.request.api('/api/scapers/players/guild/' + message.guild.id).then(function (clan) {
                        resolve({command: 'members', value: format(clan), sendType: utilities.sendType.STRING})
                    }).catch(function (err) {
                        reject({
                            command: 'members',
                            value: 'Unable to get clan from server id',
                            sendType: utilities.sendType.STRING
                        });
                    });
                }
                else {
                    utilities.request.api('/api/scapers/players/clan/' + clanLook).then(function (clan) {
                        resolve({command: 'members', value: format(clan), sendType: utilities.sendType.STRING})
                    }).catch(function (err) {
                        reject({
                            command: 'members',
                            value: 'Unable to get clan from server id',
                            sendType: utilities.sendType.STRING
                        });
                    });
                }
            }
            // cannot get clan memebers via dm
            else {

            }
        });
    };

    var format = function (clan) {
        var string = '';
        clan.forEach(function (m) {
            var xp = 0;
            if (typeof m.stats !== 'undefined') {
                xp = m.stats.skills.attack.exp;
            }
            var member = utilities.toTitle(utilities.markdown.bold(m.display)) + ' - ' +
                m.clanRank +'\n';
            string += member;
        });
        if (string.length > 2000) {
            string = string.substring(0,1996);
            string += '...';
        }
        return string;
    }
}

module.exports = new Members();
