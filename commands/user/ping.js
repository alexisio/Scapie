var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function Ping() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!ping';
    this.examples = ['!ping'];
    this.alias = [];
    this.description = 'Get the bot\'s ping';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            resolve({
                command: 'ping',
                value: format(bot),
                sendType: utilities.sendType.STRING
            });
        });
    };

    var format = function(bot) {
        return 'Websocket ping is: ' + bot.ping + 'ms';
    }
}

module.exports = new Ping();
