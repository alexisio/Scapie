const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class NexCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'nex',
            aliases: [],
            group: 'pvm',
            memberName: 'nex',
            description: 'Get Nex unique drop prices',
            examples: ['nex'],
        });
    }

    async run(message, args) {
        util.request.api(`/api/ge/batch/virtus wand, torva boots, torva gloves, torva full helm, torva platebody, torva platelegs, virtus boots, virtus gloves, virtus book, virtus mask, virtus robe legs, virtus robe top, pernix boots, pernix gloves, pernix cowl, pernix chaps, pernix body, zaryte bow`).then(prices => {
            message.embed(this.createEmbed(null, prices));
        }).catch(err => {
            console.log(err);
        });
    }

    createEmbed(result, prices) {
        let embed = new RichEmbed()
            .setAuthor('Nex Unique Drops')
            .setTimestamp()
            .setThumbnail('https://vignette1.wikia.nocookie.net/runescape2/images/f/fe/Nex.png/revision/latest/scale-to-width-down/250?cb=20170203034912')
        if (typeof prices !== 'undefined') {
            let field = '';
            prices.sortBy('-price');
            prices.forEach(item => {
                let difference = Number(item.last) - Number(item.price);
                if (typeof item.error === 'undefined') {
                    field += `${item.item}: ${Number(item.price).toLocaleString().mdbold()} ${'gp'.mdbold()} (${difference > 0 ? '+' + difference.toLocaleString() : difference.toLocaleString()})\n`;
                }
            });
            embed.setDescription(field)
        }
        return embed;
    }
};