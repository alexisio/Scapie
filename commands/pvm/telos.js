const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class TelosCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'telos',
            aliases: [],
            group: 'pvm',
            memberName: 'telos',
            description: 'Get Telos unique drop prices',
            examples: ['telos'],
        });
    }

    async run(message, args) {
        util.request.api(`/api/ge/batch/Staff_of_Sliske, Dormant Staff of Sliske, Seren godbow, Dormant Seren godbow, Zaros Godsword, Dormant Zaros godsword`).then(prices => {
            message.embed(this.createEmbed(null, prices));
        }).catch(err => {
            console.log(err);
        });
    }

    createEmbed(result, prices) {
        let embed = new RichEmbed()
            .setAuthor('Telos Unique Drops')
            .setTimestamp()
            .setThumbnail('https://vignette3.wikia.nocookie.net/runescape2/images/c/c6/Telos%2C_the_Warden.png/revision/latest/scale-to-width-down/200?cb=20160715010706')
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