var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../../utils/index');

function Calc() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!calc <expression> [#operation]';
    this.examples = ['!calc 10+10/10', '!calc x^2+2x #derive'];
    this.alias = [];
    this.description = 'Calculate the value. For simple addition / subtraction / division / multiplication, do not include an operation.' + '' +
        '\nAdvanced operations include:\n\tsimplify\n\tfactor\n\tderive\n\tintegrate\n\tzeroes\n\t(find) tangent' +
        '\n\tarea (under curve)\n\tcos\n\tsin\n\ttan\n\tarccos (inverse cosine)\n\tarcsin (invserse sin)\n\tarctan (inverse tangent)\n\tabs\n\tlog';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        var operation;
        var expression = suffix.trim();
        if (suffix.includes('#')) {
            var sepIndex = suffix.indexOf('#');
            expression = suffix.substring(0, sepIndex).trim();
            operation = suffix.substring(sepIndex + 1, suffix.length).trim();
        }
        if (operation && operation.length > 0) {
            return new Promise(function (resolve, reject) {
                utilities.request.remoteApi('https://newton.now.sh/' + operation + '/' + expression).then(function (res) {
                    console.log('yo');
                    console.log(res);
                    if (res) {
                        resolve({
                            command: 'calc: advanced',
                            value: res.result,
                            sendType: utilities.sendType.STRING
                        });
                    }
                    else {
                        reject({
                            command: 'calc: advanced',
                            value: 'Unable to calculate result',
                            sendType: utilities.sendType.STRING
                        });
                    }
                }).catch(function (err) {
                    reject({
                        command: 'calc: advanced',
                        value: 'Unable to calculate result',
                        sendType: utilities.sendType.STRING
                    });
                });

            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({
                    command: 'calc: generic',
                    value: generic(expression),
                    sendType: utilities.sendType.STRING
                });
            });
        }

    };

    var generic = function (expression) {
        var result = eval(expression.replace(/[^-()\d/*+.]/g, ''));
        return numeral(result).format();
    }

    var advanced = function (expression, operation) {
        return new Promise(function (resolve, reject) {
            console.log('lets:', operation);
            utilities.request.remoteApi('https://newton.now.sh/' + operation + '/' + expression).then(function (res) {
                console.log(res);
                resolve(res);
            }).catch(function (err) {
                reject({
                    command: 'calc: advanced',
                    value: 'Unable to calculate result',
                    sendType: utilities.sendType.STRING
                });
            });
        });
    }
}

module.exports = new Calc();
