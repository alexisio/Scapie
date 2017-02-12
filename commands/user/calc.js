var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function Calc() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!calc';
    this.examples = ['!calc 10+10/10'];
    this.alias = [];
    this.description = 'Calculate the value';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            resolve({
                command: 'calc',
                value: format(suffix),
                sendType: utilities.sendType.STRING
            });
        });
    };

    var format = function(suffix) {
        var result = eval(suffix.replace(/[^-()\d/*+.]/g, ''));
        return numeral(result).format();
    }
}

module.exports = new Calc();
