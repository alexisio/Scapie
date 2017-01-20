var Discord = require('discord.js'),
    utilities = require('./../../utils');

function Warbands() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!warbands';
    this.examples = ['!warbands']
    this.alias = ['wbs'];
    this.description = 'Get the next Warbands';
    this.type = 'distraction';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/scapers/distractions/warbands';
            utilities.request.api(apiRequest).then(function (wbs) {
                resolve({command: 'warbands', value: format(bot, wbs), sendType: utilities.sendType.STRING});
            }).catch(function(err) { reject(err); });
        });
    };

    var format = function (bot, data) {
        var next = 'Next **Warbands** in: `' + data.hours + space + (data.hours > 1 ? 'hours' : 'hour') + space
            + data.minutes + space + (data.minutes > 1 ? 'minutes' : 'minute') + space
            + data.seconds + space + (data.seconds > 1 ? 'seconds`' : 'second`');

        return next;
    };
}

module.exports = new Warbands();
