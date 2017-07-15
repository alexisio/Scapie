const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class CircusCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'circus',
            aliases: [],
            group: 'minigames',
            memberName: 'circus',
            description: 'Get the circus location',
            examples: ['circus'],
        });
    }

    async run(message, args) {
        let api = `/api/minigames/circus`;
        util.request.api(api).then(result => {
            message.embed(this.createEmbed(result));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result) {
        let nextStart = new Date(result[1].startDate);
        nextStart.setHours(0,0,0,0);
        let diff = new moment.duration(Math.abs(nextStart - new Date()));
        let dhm = `${diff.days()}d ${diff.hours()}h ${diff.minutes()}m`;
        let embed = new RichEmbed()
            .setAuthor(`Circus`, ``, ``)
            .setThumbnail(`https://vignette2.wikia.nocookie.net/runescape2/images/6/6e/Ring_master.png/revision/latest/scale-to-width-down/200?cb=20101013183423`)
            .setTimestamp()
            .setDescription(`The circus is located at ${result[0].location.mdbold()} for another ${dhm.mdbold()}\n` +
                `${result[1].location.mdbold()} will follow`)
        return embed;
    }
};