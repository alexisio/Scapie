var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils'),
    rwc = require('random-weighted-choice');

function Randomizer() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!randomizer <user>=<weight>, <user>=<weight>';
    this.examples = ['!randomizer sync=5, lost-theorie=5, irri=5, drake=5'];
    this.alias = [];
    this.description = 'Chooses a username based on a weighted randomized number';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        var input = suffix.split(',');
        return new Promise(function (resolve, reject) {
            resolve({
                command: 'randomizer',
                value: choose(input),
                sendType: utilities.sendType.STRING
            });
        });
    };

    var choose = function (input) {
        var table = [];
        input.forEach(function (d) {
            if (d.includes('=')) {
                var vals = d.split('=');
                var weight = {weight: parseInt(vals[1].trim()), id: vals[0].trim()};
                table.push(weight);
            }
        });
        var chosen = rwc(table);
        return 'The winner is: ' + utilities.markdown.bold(utilities.toTitle(chosen));
    };

}

module.exports = new Randomizer();
