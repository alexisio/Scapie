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
                var clan;
                suffix = suffix.trim().substring(cmd.length, suffix.length).trim();
                clan = suffix;
                var mod;
                if (suffix.includes('#')) {
                    var sepIndex = suffix.indexOf('#');
                    clan = suffix.substring(0, sepIndex).trim();
                    mod = suffix.substring(sepIndex + 1, suffix.length).trim();
                }
                switch (cmd.toLowerCase()) {
                    case 'clan':
                        message.channel.sendMessage('Please wait...update speeds are limited by Jagex\'s API timeout threshold so depending on the number of players in the clan, an update may take a while. There are 3 steps to an update and a message will be posted with each update completion.');
                        // call member check
                        utilities.request.api('/api/scapers/clans/' + clan + '/members', utilities.httpMethod.PUT).then(function (members) {
                            if (members) {
                                message.channel.sendMessage('Step 1 complete. Step 2 is the longest step. Please be patient...');
                                utilities.request.api('/api/scapers/players/stats/clan/' + clan, utilities.httpMethod.PUT).then(function (stats) {
                                    if (stats) {
                                        message.channel.sendMessage('Step 2 complete.');
                                        utilities.request.api('/api/scapers/players/names/clan/' + clan, utilities.httpMethod.PUT).then(function (names) {
                                            if (names) {
                                                resolve({
                                                    command: 'update clan',
                                                    value: format(names),
                                                    sendType: utilities.sendType.EMBED
                                                });
                                            }
                                        });
                                    }
                                })
                            }
                        });
                        break;
                    case 'logs': {
                        var apiPath = '/api/scapers/clanlogs/' + clan;
                        if (mod && mod.length > 0) {
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
                    changeLog += utilities.toTitle(utilities.markdown.bold(change.from.display)) + ' changed name to ' + utilities.toTitle(utilities.markdown.bold(change.to.display));
                });
                if (changeLog.length > 1024) {
                    changeLog = changeLog.substring(0, 1019);
                    changeLog += '...';
                }
                embed.addField('Name Changes', changeLog);
            }
            if (changes.added.length > 0) {
                isChange = true;
                var additionLog = '';
                changes.added.forEach(function (a) {
                    additionLog += utilities.toTitle(a.display) + '\n';
                });
                if (additionLog.length > 1024) {
                    additionLog = additionLog.substring(0, 1019);
                    additionLog += '...';
                }
                embed.addField('Additions', additionLog);
            }
            if (changes.removed.length > 0) {
                isChange = true;
                var removedLog = '';
                changes.removed.forEach(function (r) {
                    removedLog += utilities.toTitle(r.display)  + '\n';
                });
                if (removedLog.length > 1024) {
                    removedLog = removedLog.substring(0, 1019);
                    removedLog += '...';
                }
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
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Recent Logs', '');
        logs.splice(0,24).forEach(function(log) {
            embed.addField(log.type.toUpperCase() + ' - ' + log.createdAt, log.old + ' -> ' + log.new.display);
        });
        return embed;
    }
}

module.exports = new Update();
