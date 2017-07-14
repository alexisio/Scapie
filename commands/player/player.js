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
            name: 'player',
            aliases: ['getclan', 'details'],
            group: 'player',
            memberName: 'player',
            description: 'Get players details',
            examples: ['player sync'],
        });
    }

    async run(message, args) {
        emojis = message.client.emojis;
        let username = args;

        let api = `/api/players/${username}/details`;
        let profileApi = `/api/players/${username}/profile`;

        util.request.api(api).then(result => {
            util.request.api(profileApi).then(profile => {
                this.createEmbed(result, profile).then(embed => {
                    console.log('send message');
                    message.embed(embed);
                });
            }).catch(err => {
                this.createEmbed(result).then(embed => {
                    return message.embed(embed);
                });
                console.log('err', err);
            })
        }).catch(err => {
            console.log('err', err);
        });
    }

    async createEmbed(result, profile) {
        const p = result[0];
        var ava = `https://secure.runescape.com/m=avatar-rs/'${p.name.trim().replace(/ /g, '%20')}/chat.png?timestamp=${new Date().getTime()}`;
        let embed = new RichEmbed()
            .setAuthor(`${p.isSuffix ? p.name.trim().toTitleCase() + ' ' + p.title : p.title + ' ' + p.name.trim().toTitleCase()}`, 'http://vignette3.wikia.nocookie.net/runescape2/images/8/88/RuneMetrics_icon.png/revision/latest?cb=20160421161211', `https://apps.runescape.com/runemetrics/app/overview/player/${p.name.trim().replace(/ /g, '%20')}`)
            .setTimestamp()
            .setThumbnail(ava)
            .addField(`Ingame Status`.mdbold(), `${p.online ? p.world : 'Offline'}`, true)
            .addField(`Clan`.mdbold(), `${p.clan ? p.clan : 'No Clan'}`, true);
        if (typeof profile !== 'undefined' && typeof profile.error === 'undefined') {
            embed.setDescription(`${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'overall'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'overall'.toTitleCase()) : 'overall'.toTitleCase()} ${profile.totalskill.toLocaleString().mdbold()}\n` +
                `${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'xp'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'xp'.toTitleCase()) : 'xp'.toTitleCase()} ${profile.totalxp.toLocaleString()}\n` +
                `${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'rank'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'rank'.toTitleCase()) : 'rank'.toTitleCase()} ${profile.rank.toLocaleString()}`)
            if (typeof profile.activities !== 'undefined' && profile.activities.length > 4) {
                let s = '';
                profile.activities.splice(0, 5).forEach(function (activity) {
                    s += `${activity.text.toLowerCase().indexOf('levelled') > -1 ? activity.details : activity.text}\n`
                });
                embed.addField('Recent Achievements', s, false);
            }
        }
        return embed;
    }
};