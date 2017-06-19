var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function Me() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!me <skill>';
    this.examples = ['!me', '!me #prayer']
    this.alias = [];
    this.description = 'Get your stats';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            utilities.request.api('/api/scapers/players/discord/' + message.author.id).then(function(player) {
                console.log(player);
                if (typeof player.message == 'undefined') {
                    resolve({command:'me', value: 'You are associated with RSN ' + utilities.toTitle(utilities.markdown.bold(player.display)), sendType: utilities.sendType.STRING})
                }
                else {
                    resolve({command: 'me', value: player.message, sendType: utilities.sendType.STRING});
                }
            }).catch(function (err) {
                reject({command: 'me', value: 'Unable to get !me', sendType: utilities.sendType.STRING});
            });
        });
    };
}

module.exports = new Me();
