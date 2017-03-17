var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function Perk() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!perk <name>';
    this.examples = ['!perk aftershock'];
    this.alias = [];
    this.description = 'Searches the RS Wikia for an article about the perk';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        var perk = suffix.trim().replace(/ /g, '+');
        return new Promise(function (resolve, reject) {
            utilities.request.remoteApi('http://runescape.wikia.com/api/v1/Search/List?query=' + perk + '+perk+invention&limit=25&minArticleQuality=10&batch=1&namespaces=0%2C14').then(function (res) {
                if (res) {
                    resolve({
                        command: 'perk',
                        value: res.items[0].url,
                        sendType: utilities.sendType.STRING
                    });
                }
                else {
                    reject({
                        command: 'perk',
                        value: 'Unable to get the perk',
                        sendType: utilities.sendType.STRING
                    });
                }
            }).catch(function (err) {
                reject({
                    command: 'perk',
                    value: 'Unable to get the perk',
                    sendType: utilities.sendType.STRING
                });
            });
        });


    };

}

module.exports = new Perk();
