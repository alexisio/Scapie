var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../utils');

function Stats() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!stats <username>[, <skill>]';
    this.examples = ['!stats Sync', '!stats Sync, prayer']
    this.alias = ['hiscores'];
    this.description = 'Get a users stats';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        var lookup;
        var name = suffix.trim();
        if (suffix.includes('#')) {
            var sepIndex = suffix.indexOf('#');
            name = suffix.substring(0, sepIndex).trim();
            lookup = suffix.substring(sepIndex + 1, suffix.length).trim();
        }
        name = name.replace(/ /g, '%20');
        return new Promise(function (resolve, reject) {
            utilities.request.api('/api/rs/player/hiscores/' + name).then(function (stats) {
                resolve({command: 'stats', value: format(bot, stats, lookup), sendType: utilities.sendType.EMBED});
            }).catch(function (err) {
                reject({command: 'stats', value: 'Unable to find user\'s hiscore record', sendType: utilities.sendType.STRING});
            });
        });
    };

    var skillTypes = {
        'combat': {
            'skills': [
                'attack',
                'strength',
                'defence',
                'ranged',
                'prayer',
                'magic',
                'hitpoints',
                'summoning'
            ]
        },
        'gathering': {
            'skills': [
                'mining',
                'fishing',
                'woodcutting',
                'farming',
                'hunter',
                'divination'
            ]
        },
        'artisan': {
            'skills': [
                'herblore',
                'crafting',
                'fletching',
                'smithing',
                'cooking',
                'firemaking',
                'runecrafting',
                'construction'
            ]
        },
        'support': {
            'skills': [
                'agility',
                'thieving',
                'slayer',
                'dungeoneering',
                'invention'
            ]
        }
    }

    var format = function (bot, data, lookup) {
        var embed = new Discord.RichEmbed();
        var skills = data.skills;
        if (typeof lookup === 'undefined') {
            embed.setAuthor('Stats for ' + utilities.toTitle(data.username.trim()), 'http://vignette3.wikia.nocookie.net/runescape2/images/d/db/Stats_Overall_icon_highscores.png/revision/latest/scale-to-width-down/21?cb=20130829204717', '')

            var overallEmoji = bot.emojis !== 'undefined' ? bot.emojis.find('name', utilities.toTitle('Overall')) : 'Overall';
            var overall = overallEmoji + space + utilities.markdown.bold(numeral(skills['overall'].level).format()) + linebreak + '\t\t' + numeral(skills['overall'].exp).format() + linebreak;
            embed.setDescription(overall)

            for (var skillType in skillTypes) {
                var subset = skillTypes[skillType];
                var skillSet = '';
                subset.skills.forEach(function (skill) {
                    var emoji = bot.emojis !== 'undefined' ? bot.emojis.find('name', utilities.toTitle(skill)) : undefined;
                    if (typeof emoji === 'undefined') {
                        emoji = utilities.toTitle(skill);
                    }
                    skillSet += emoji + space + utilities.markdown.bold(skills[skill].level) + ' | ' + numeral(skills[skill].exp).format() + linebreak;
                });

                embed.addField(utilities.markdown.bold(utilities.toTitle(skillType)), skillSet, true);
            }
        }
        else {
            var skillSet = '';
            lookup = lookup.trim();
            embed.setAuthor(utilities.toTitle(data.username.trim()) + '\'s ' + utilities.toTitle(lookup) + ' hiscore', 'http://vignette3.wikia.nocookie.net/runescape2/images/d/db/Stats_Overall_icon_highscores.png/revision/latest/scale-to-width-down/21?cb=20130829204717', '')
            var emoji = bot.emojis !== 'undefined' ? bot.emojis.find('name', utilities.toTitle(lookup)) : undefined;
            if (typeof emoji === 'undefined') {
                emoji = utilities.toTitle(lookup);
            }

            skillSet += emoji + space + utilities.markdown.bold(skills[lookup].level) + ' | '
                + numeral(skills[lookup].exp).format() + ' | '
                + numeral(skills[lookup].rank).format()
                + linebreak;
            embed.addField(utilities.markdown.bold(utilities.toTitle(lookup)), skillSet, true);
        }
        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        var ava = 'https://secure.runescape.com/m=avatar-rs/' + data.username.trim().replace(/ /g, '%20') + '/chat.png';
        embed.setThumbnail(ava);
        return embed;
    };

}

module.exports = new Stats();
