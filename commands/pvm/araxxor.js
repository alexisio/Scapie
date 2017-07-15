const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class AraxxorCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'araxxor',
            aliases: ['rax','spider','spooder'],
            group: 'pvm',
            memberName: 'araxxor',
            description: 'Get Araxxor rotation',
            examples: ['araxxor'],
        });
    }

    async run(message, args) {
        let date = args;

        let api = `/api/pvm/araxxor/${typeof date !== 'undefined' && Date.parse(date) !== NaN ? date.trim().replace(/\//g, '-') : ''}`;
        util.request.api(api).then(result => {
            util.request.api(`/api/ge/batch/spider leg,noxious scythe, noxious staff, noxious longbow`).then(prices => {
                message.embed(this.createEmbed(result, prices));
            }).catch(err => {
                message.embed(this.createEmbed(result));
            });
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result, prices) {
        let nextStart = new Date(result[1].startDate);
        nextStart.setHours(0,0,0,0);
        let diff = new moment.duration(Math.abs(nextStart - new Date()));
        let dhm = `${diff.days()}d ${diff.hours()}h ${diff.minutes()}m`;
        let embed = new RichEmbed()
            .setAuthor('Araxxor Rotation')
            .setThumbnail('https://vignette1.wikia.nocookie.net/runescape2/images/f/f2/Araxxor.png/revision/latest/scale-to-width-down/250?cb=20140729225744')
            .setTimestamp()
            .addField('Current', `Open: ${result[0].rotation.open[0].characteristic.mdbold()} and ${result[0].rotation.open[1].characteristic.mdbold()}\nClosed: ${result[0].rotation.closed.characteristic.mdbold()}\nFor: ${dhm.mdbold()}`)
            .addField('Next', `Open: ${result[1].rotation.open[0].characteristic.mdbold()} and ${result[1].rotation.open[1].characteristic.mdbold()}\nClosed: ${result[1].rotation.closed.characteristic.mdbold()}`)
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