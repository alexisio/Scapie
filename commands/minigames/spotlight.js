const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

const minigameAlias = {
    'pc': 'pest control',
    'sw': 'soul wars',
    'fog': 'fist of guthix',
    'ba': 'barbarian assault',
    'con': 'conquest',
    'ft': 'fishing trawler',
    'gop': 'great orb project',
    'cw': 'castle wars',
    'sc': 'stealing creation',
    'cfb': 'cabbage facepunch bonanza',
    'heist': 'heist',
    'ma': 'mobilising armies',
    'tb': 'trouble brewing'
};
module.exports = class SpotlightCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'spotlight',
            aliases: ['thaler','minigame', 'minigames'],
            group: 'minigames',
            memberName: 'spotlight',
            description: 'Get current spotlight, the next time a minigame is on spotlight, or the minigame on spotlight for a specific date',
            examples: ['spotlight','spotlight cw','spotlight 06-06-2026'],
        });
    }

    async run(message, args) {
        let val = typeof minigameAlias[args.trim()] !== 'undefined' ? minigameAlias[args.trim()] : args.trim();
        let api = `/api/minigames/spotlight/${val.trim().length > 0 ? val.replace(/ /g, '%20').replace(/\//g, '-') : ''}`;
        console.log(api);
        util.request.api(api).then(result => {
            this.createEmbed(result).then(embed => {
                message.embed(embed);
            })
        }).catch(err => {
            console.log('err', err);
        });
    }

    async createEmbed(result) {
        let dhm = '';
        let future = true;
        if (result.length > 1) {
            future = false;
            let nextStart = new Date(result[1].startDate);
            nextStart.setHours(0, 0, 0, 0);
            let diff = new moment.duration(Math.abs(nextStart - new Date()));
            dhm = `${diff.days()}d ${diff.hours()}h ${diff.minutes()}m`;
        }
        let embed = new RichEmbed()
            .setAuthor(`Minigame Spotlight`,``)
            .setTimestamp();
        if (!future) {
            embed.addField('Rotation', `${result[0].rotation.mdbold()} is on spotlight for another ${dhm.mdbold()}\n` +
                `${result[1].rotation.mdbold()} will follow`);
        }
        else {
            console.log(typeof result);
            let r = Array.isArray(result) ? result[0] : result;
            embed.addField('Rotation', `${r.rotation.mdbold()} will be on spotlight starting on ${moment(r.startDate).format('LL').mdbold()}\n`);
        }

        return embed;
    }
};