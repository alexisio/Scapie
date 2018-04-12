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
};
const skills = [
    'Overall',
    'Attack',
    'Defence',
    'Strength',
    'Hitpoints',
    'Ranged',
    'Prayer',
    'Magic',
    'Cooking',
    'Woodcutting',
    'Fletching',
    'Fishing',
    'Firemaking',
    'Crafting',
    'Smithing',
    'Mining',
    'Herblore',
    'Agility',
    'Thieving',
    'Slayer',
    'Farming',
    'Runecrafting',
    'Hunter',
    'Construction',
    'Summoning',
    'Dungeoneering',
    'Divination',
    'Invention'
]
let emojis = undefined;
module.exports = class TrackerCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'tracker',
            aliases: ['gains', 'gainz', 'track', 'gain'],
            group: 'player',
            memberName: 'tracker',
            description: 'Get daily XP gains via the Scapers platform',
            examples: ['tracker sync']
        });
    }

    async run(message, args) {
        emojis = message.client.emojis;
        let username = args;

        let remoteApi = `${process.env.SCAPERS}/api/snapshots/player/${username.toLowerCase()}/recent`;
        let api = `/api/players/${username}/stats`;

        util.request.remoteApi(remoteApi).then(snapshot => {
            util.request.api(api).then(stats => {
                this.createEmbed(snapshot, stats).then(embed => {
                    message.embed(embed);
                });
            });            
        }).catch(err => {
            console.log('err in snap', err);
        });
    }

    async createEmbed(snapshot, stats) {
        let ava = `https://secure.runescape.com/m=avatar-rs/'${stats.name.trim().replace(/ /g, '%20')}/chat.png?timestamp=${new Date().getTime()}`;
        let embed = new RichEmbed()
            .setThumbnail(ava)
            .setTimestamp();
        this.delta(snapshot, stats).then(change => {
            embed.setAuthor(`${stats.name.trim().toTitleCase()}'s XP Today`)
                .setDescription(`${ typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == 'overall'.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == 'overall'.toTitleCase()) : 'overall'.toTitleCase()} ${change['overall'].exp.toLocaleString().mdbold()}\n`)
            for (let skillType in skillTypes) {
                let subset = skillTypes[skillType];
                let set = '';
                subset.skills.forEach(function (skill) {
                    let emoji = typeof emojis !== 'undefined' && typeof emojis.find(item => item.name == skill.toTitleCase()) !== 'undefined' ? emojis.find(item => item.name == skill.toTitleCase()) : skill.toTitleCase();
                    set += `${emoji} ${change[skill].exp.toLocaleString()} \n`;
                });
                skillType = skillType.toTitleCase();
                embed.addField(skillType, set, true);
            }
        });
        return embed;
    }
    
    async delta(snapshot, current) {
        let change = {};
        for (var i = 0; i < skills.length; i++) {
            let name = skills[i].toLowerCase();
            let rankChange = current.stats[name].rank - snapshot.stats.skills[name].rank;
            let levelChange = current.stats[name].level - snapshot.stats.skills[name].level;
            let expChange = current.stats[name].exp - snapshot.stats.skills[name].exp;
            change[name] = {
                rank: Number(rankChange),
                level: Number(levelChange),
                exp: Number(expChange)
            }
        }
        return change;
    }
};
