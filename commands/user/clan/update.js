var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../../utils/index');

function Update() {
    this.usage = '!update <type> [mod]';
    this.examples = ['!update clan maximized'];
    this.alias = [];
    this.description = 'Temp command to update stuff';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            if (message.channel.type == 'text') {
                var cmd = suffix.trim().split(' ')[0];
                suffix = suffix.trim().substring(cmd.length, suffix.length).trim();
                var mod;
                if (suffix.includes('#')) {
                    var sepIndex = suffix.indexOf('#');
                    suffix = suffix.substring(0, sepIndex).trim();
                    mod = suffix.substring(sepIndex + 1, suffix.length).trim();
                }
                switch (cmd.toLowerCase()) {
                    case 'clan':
                        message.channel.sendMessage('Please wait...update speeds are limited by Jagex\'s API timeout threshold so depending on the number of players in the clan, an update may take a while. There are 3 steps to an update and a message will be posted with each update completion.');
                        // call member check
                        utilities.request.api('/api/scapers/clans/' + suffix + '/members', utilities.httpMethod.PUT).then(function (members) {
                            if (members) {
                                message.channel.sendMessage('Step 1 complete. Step 2 is the longest step. Please be patient...');
                                utilities.request.api('/api/scapers/players/stats/clan/' + suffix, utilities.httpMethod.PUT).then(function (stats) {
                                    if (stats) {
                                        message.channel.sendMessage('Step 2 complete.');
                                        utilities.request.api('/api/scapers/players/names/clan/' + suffix, utilities.httpMethod.PUT).then(function (names) {
                                            if (names) {
                                                resolve({
                                                    command: 'update clan',
                                                    value: format(names),
                                                    sendType: utilities.sendType.EMBED
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                        });
                        break;
                    case 'logs': {
                        var apiPath = '/api/scapers/clanlogs/' + suffix;
                        if (mod && mod.length > 0) {
                            console.log(mod);
                            apiPath += '/' + mod;
                        }
                        utilities.request.api(apiPath).then(function (logs) {
                            if (logs) {
                                resolve({
                                    command: 'update logs',
                                    value: formatLogs(logs),
                                    sendType: utilities.sendType.EMBED
                                });
                            }
                        });
                    }
                }
            }
            // cannot get clan memebers via dm
            else {

            }
        });
    };

    var format = function (changes) {
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Update Clan', '');
        if (typeof changes.message == 'undefined') {
            var isChange = false;
            if (changes.changed.length > 0) {
                isChange = true;
                var changeLog = '';
                changes.changed.forEach(function (change) {
                    changeLog += utilities.markdown.bold(change.from.display) + ' changed name to ' + utilities.markdown.bold(change.to.display);
                });
                embed.addField('Name Changes', changeLog);
            }
            if (changes.added.length > 0) {
                isChange = true;
                var additionLog = '';
                changes.added.forEach(function (a) {
                    additionLog += utilities.markdown.bold(a.display) + ' was added to the clan';
                });
                embed.addField('Additions', additionLog);
            }
            if (changes.removed.length > 0) {
                isChange = true;
                var removedLog = '';
                changes.removed.forEach(function (r) {
                    removedLog += utilities.markdown.bold(r.display) + ' was removed from the clan';
                });
                embed.addField('Removals', removedLog);
            }
            if (!isChange) {
                embed.setDescription('No clan changes found. User current hiscores updated.');
            }
        }
        else {
            embed.setDescription(changes.message);
        }
        return embed;
    };

    var formatLogs = function(logs) {
        console.log(logs);
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Recent Logs', '');
        logs.splice(0,24).forEach(function(log) {
            embed.addField(log.type.toUpperCase() + ' - ' + log.createdAt, log.old + ' -> ' + log.new);
        });
        return embed;
    }
}

module.exports = new Update();
