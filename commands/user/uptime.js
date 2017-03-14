var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function Uptime() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!uptime';
    this.examples = ['!uptime'];
    this.alias = [];
    this.description = 'Get the bot\'s uptime';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            resolve({
                command: 'uptime',
                value: format(bot),
                sendType: utilities.sendType.STRING
            });
        });
    };

    var format = function(bot) {
        console.log(bot.uptime);
        var up = utilities.msToDHMS(bot.uptime);
        var uptime = '';
        if (up.days > 0) {
            uptime += up.days + 'd';
        }
        if (up.hours > 0) {
            uptime += up.hours + 'h';
        }
        if (up.minutes > 0) {
            uptime += up.minutes + 'm';
        }
        if (up.seconds > 0) {
            uptime += up.seconds + 's';
        }
        return 'Scapie has been online for: ' + uptime;
    }
}

module.exports = new Uptime();
