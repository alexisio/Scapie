const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class WarbandsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'warbands',
            aliases: ['warband', 'wbs', 'wb'],
            group: 'minigames',
            memberName: 'warbands',
            description: 'Get next warbands time',
            examples: ['warbands', 'wbs'],
        });
    }

    async run(message, args) {
        let api = `/api/minigames/warbands`;
        util.request.api(api).then(result => {
            message.embed(this.createEmbed(result));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result) {
        let embed = new RichEmbed()
            .setAuthor(`Warbands`, ``)
            .setTimestamp()
            .setDescription(`Next ${'Warbands'} in: **${result.hours > 1 ? result.hours + ' hours' : result.hours + ' hour'} ` +
                        `${result.minutes > 1 ? result.minutes + ' minutes' : result.minutes + ' minute'} ` +
                        `${result.seconds > 1 ? result.seconds + ' seconds' : result.seconds + ' second'}**`)
        return embed;
    }
};