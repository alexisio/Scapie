var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../../utils/index');

function Activity() {
    this.usage = '!events [mod]';
    this.examples = ['!update clan maximized'];
    this.alias = [];
    this.description = 'Temp command to get event log';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            if (message.channel.type == 'text') {
                var clan;
                clan = suffix;
                var mod;
                if (suffix.includes('#')) {
                    var sepIndex = suffix.indexOf('#');
                    clan = suffix.substring(0, sepIndex).trim();
                    mod = suffix.substring(sepIndex + 1, suffix.length).trim();
                }

                console.log('clan', clan.trim());
                console.log('mod',mod);

                var apiPath = '/api/scapers/clanlogs/';
                if ((!clan || clan.trim().length < 1) && (mod && mod.length > 0)) {
                    apiPath += 'type/' + mod + '/';
                }
                else {
                    if (clan && clan.length > 0) {
                        apiPath += 'clan/' + clan.trim() + '/';
                    }
                    if (mod && mod.length > 0) {
                        apiPath += mod + '/';
                    }
                }
                console.log('apiPath', apiPath);
                utilities.request.api(apiPath).then(function (logs) {
                    if (logs) {
                        resolve({
                            command: 'activity',
                            value: formatLogs(logs),
                            sendType: utilities.sendType.EMBED
                        });
                    }
                });
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
                    changeLog += utilities.toTitle(utilities.markdown.bold(change.from.display)) + ' changed name to ' + utilities.toTitle(utilities.markdown.bold(change.to.display)) + '\n';
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
                    removedLog += utilities.toTitle(r.display) + '\n';
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

    var formatLogs = function (logs) {
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Activity', '');
        embed.setDescription('Displaying the last 25 activity logs for the clan');
        var logsStr = '';
        if (logs && logs.length > 0) {
            var max = 25;
            if (logs.length < 25) {
                max = logs.length;
            }
            logs.splice(0, max).forEach(function (log) {
                var logStr = '';
                var strCount = 0;
                switch (log.event) {
                    case 'memberjoin', 'memberleft':
                        if (log.type == 'player') {
                            var lj = log.event == 'memberjoin' ? 'joined' : 'left';
                            console.log('we in join/left');
                            logStr += utilities.toTitle(utilities.markdown.bold(log.new.display)) + ' ' + lj + ' the clan';
                            if (log.previous && log.previous.clan) {
                                var ff = log.event == 'memberjoin' ? 'from' : 'for';
                                logStr += ' ' + ff + ' ' + utilities.toTitle(utilities.markdown.bold(log.previous.clan.name));
                            }
                            logStr += '\n';
                            strCount += logStr.length;
                            logsStr += logStr;
                        }
                        break;
                    case 'rsnchange':
                        if (log.type == 'player') {
                            console.log('new',log.new.display);
                            console.log('old',log.previous.display);
                            logStr += utilities.toTitle(utilities.markdown.bold(log.previous.display)) + ' changed their RSN to ' + utilities.toTitle(utilities.markdown.bold(log.new.display));
                            logStr += '\n';
                            strCount += logStr.length;
                            logsStr += logStr;
                        }
                        break;
                }

            });
        }
        else  {
            logsStr += 'Nothing has happened';
        }
        console.log(logsStr);
        embed.addField('Recent', logsStr);
        return embed;
    }
}

module.exports = new Activity();
