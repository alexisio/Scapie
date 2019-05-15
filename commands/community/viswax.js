const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class ViswaxCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'viswax',
            aliases: ['vis'],
            group: 'community',
            memberName: 'viswax',
            description: 'Get next warbands time',
            examples: [],
        });
    }

    async run(message, args) {
        let api = `/api/minigames/viswax`;
        util.request.api(api).then(result => {
            message.embed(this.createEmbed(result));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result) {
        let embed = new RichEmbed()
            .setAuthor('Vis Wax FC', 'https://secure.runescape.com/m=avatar-rs/SugarsTiamat/chat.png', '')
            .setThumbnail('http://vignette1.wikia.nocookie.net/runescape2/images/4/49/Vis_wax_detail.png/revision/latest/scale-to-width-down/150?cb=20140915115106')
            .addField('First Rune', result.slot1.replace(/\(/g, ' ('))
            .addField('Second Rune', result.slot2.replace(/\(/g, ' (').replace(/\) /g, ')\n').replace(/,/g, ', '))
            .setFooter(result.lastUpdate);
        return embed;
    }
};
