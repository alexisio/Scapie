const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class AoDCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'aod',
            aliases: ['angel'],
            group: 'pvm',
            memberName: 'aod',
            description: 'Get AoD unique drop prices',
            examples: ['aod'],
        });
    }

    async run(message, args) {
        util.request.api(`/api/ge/batch/Wand of the praesul,Imperium core,Praesul codex,Intricate blood stained chest,Intricate ice chest,Intricate shadow chest,Intricate smoke-shrouded chest`).then(prices => {
            message.embed(this.createEmbed(null, prices));
        }).catch(err => {
            console.log(err);
        });
    }

    createEmbed(result, prices) {
        let embed = new RichEmbed()
            .setAuthor('AoD Unique Drops')
            .setTimestamp()
            .setThumbnail('https://vignette2.wikia.nocookie.net/runescape2/images/2/2b/Nex_%28Angel_of_Death%29.png/revision/latest/scale-to-width-down/250?cb=20170130192323')
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