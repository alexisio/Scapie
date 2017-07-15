const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class VoragoCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'vorago',
            aliases: ['rago'],
            group: 'pvm',
            memberName: 'vorago',
            description: 'Get Vorago rotation',
            examples: ['vorago'],
        });
    }

    async run(message, args) {
        let date = args;

        let api = `/api/pvm/vorago/${typeof date !== 'undefined' && Date.parse(date) !== NaN ? date.trim().replace(/\//g, '-') : ''}`;
        util.request.api(api).then(result => {
            util.request.api(`/api/ge/batch/tectonic energy,seismic wand,seismic singularity`).then(prices => {
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
            .setAuthor('Vorago Rotations')
            .setTimestamp()
            .setThumbnail('')
            .addField('Rotation', `${result[0].rotation.normal.mdbold()} for another ${dhm.mdbold()}\n${result[1].rotation.normal.mdbold()} will follow`)
            .addField('Hardmode', `Phase 10: ${result[0].rotation.hard.phase10.mdbold()}\nPhase 11: ${result[0].rotation.hard.phase11.mdbold()}\nUnlock: ${result[0].rotation.hard.unlock.mdbold()}`);
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