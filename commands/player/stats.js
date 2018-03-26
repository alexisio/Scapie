const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils');

const skillTypes = {
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
let emojis = undefined;
module.exports = class StatsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            aliases: ['hiscores'],
            group: 'player',
            memberName: 'stats',
            description: 'Get players stats',
            examples: ['stats sync'],
        });
    }

    async run(message, args) {
        emojis = message.client.emojis;
        let username = args;
        let stat = undefined;
        if (username.indexOf('#') > -1) {
            stat = username.substring(username.indexOf('#') + 1, username.length).trim();
            username = username.substring(0, username.indexOf('#')).trim();
        }

        let api = `/api/players/${username}/stats/${typeof stat !== 'undefined' ? stat : ''}`;

        util.request.api(api).then(result => {
            console.log(result);
            message.embed(this.createEmbed(result));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result) {
        var ava = `https://secure.runescape.com/m=avatar-rs/'${result.name.trim().replace(/ /g, '%20')}/chat.png?timestamp=${new Date().getTime()}`;
        let embed = new RichEmbed()
            .setThumbnail(ava)
            .setTimestamp()
        if (typeof result.stats === 'undefined') {
            embed.setAuthor(`${result.skill.toTitleCase()} hiscore for ${result.name.trim().toTitleCase()}`)
            embed.setDescription(`${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == result.skill.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == result.skill.toTitleCase()) : 'overall'.toTitleCase()} ${result.detail.level.toLocaleString().mdbold()}\n` +
                `${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'xp'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'xp'.toTitleCase()) : 'xp'.toTitleCase()} ${result.detail.exp.toLocaleString()}\n` +
                `${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'rank'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'rank'.toTitleCase()) : 'rank'.toTitleCase()} ${result.detail.rank.toLocaleString()}`)
        }
        else {
            embed.setAuthor(`Stats for ${result.name.trim().toTitleCase()}`)
                .setDescription(`${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'overall'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'overall'.toTitleCase()) : 'overall'.toTitleCase()} ${result.stats['overall'].level.toLocaleString().mdbold()}\n` +
                    `${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'xp'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'xp'.toTitleCase()) : 'xp'.toTitleCase()} ${result.stats['overall'].exp.toLocaleString()}\n` +
                    `${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'rank'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'rank'.toTitleCase()) : 'rank'.toTitleCase()} ${result.stats['overall'].rank.toLocaleString()}`)
            for (let skillType in skillTypes) {
                let subset = skillTypes[skillType];
                let set = '';
                subset.skills.forEach(function (skill) {
                    let emoji = typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == skill.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == skill.toTitleCase()) : skill.toTitleCase();
                    set += `${emoji} ${result.stats[skill].level.toString().toTitleCase().mdbold()} | ${result.stats[skill].exp.toLocaleString()} \n`;
                });
                skillType = skillType.toTitleCase();
                embed.addField(skillType, set, true);
            }
        }
        return embed;
    }
};