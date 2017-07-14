const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils');

module.exports = class RotsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'rots',
            aliases: ['rise'],
            group: 'pvm',
            memberName: 'rots',
            description: 'Get rots rotation',
            examples: ['rots'],
        });
    }

    async run(message, args) {
        let date = args;

        let api = `/api/pvm/rots/${typeof date !== 'undefined' && Date.parse(date) !== NaN ? date.trim().replace(/\//g, '-') : ''}`;
        console.log(api);
        util.request.api(api).then(result => {
            util.request.api(`/api/ge/batch/malevolent energy,malevolent kiteshield,merciless kiteshield,vengeful kiteshield`).then(prices => {
                message.embed(this.createEmbed(result, prices));
            }).catch(err => {
                message.embed(this.createEmbed(result));
            });
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result, prices) {
        let bobbled = [
            'http://vignette3.wikia.nocookie.net/runescape2/images/7/7d/Karil_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015446',
            'http://vignette4.wikia.nocookie.net/runescape2/images/c/cd/Ahrim_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015444',
            'http://vignette2.wikia.nocookie.net/runescape2/images/1/17/Torag_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015446',
            'http://vignette3.wikia.nocookie.net/runescape2/images/f/fa/Verac_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126151047',
            'http://vignette1.wikia.nocookie.net/runescape2/images/8/80/Guthan_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015445',
            'http://vignette2.wikia.nocookie.net/runescape2/images/c/c6/Dharok_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015445'
        ];
        let embed = new RichEmbed()
            .setAuthor('Rise of the Six Rotations')
            .setTimestamp()
            .setThumbnail(bobbled[Math.floor(Math.random() * 6)])
            .addField('Today', `${'East:'.mdbold()}\t  ${result[0].rotation.east}\n${'West:'.mdbold()}\t${result[0].rotation.west}`)
            .addField('Tomorrow', `${'East:'.mdbold()}\t  ${result[1].rotation.east}\n${'West:'.mdbold()}\t${result[1].rotation.west}`);
        if (typeof prices !== 'undefined') {
            let field = '';
            prices.forEach(item => {
                let difference = Number(item.last) - Number(item.price);
                if (typeof item.error === 'undefined') {
                    field += `${item.item}: ${Number(item.price).toLocaleString().mdbold()} ${'gp'.mdbold()} (${difference > 0 ? '+' + difference.toLocaleString() : difference.toLocaleString()})\n`;
                }
            });
            embed.addField('Unique Drops', field)
        }
        return embed;
    }
};