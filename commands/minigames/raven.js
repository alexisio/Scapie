const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class RavenCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'raven',
            aliases: [],
            group: 'minigames',
            memberName: 'raven',
            description: 'Get the status of the raven in Prifddinas',
            examples: ['circus'],
        });
    }

    async run(message, args) {
        util.request.api(`/api/minigames/raven`).then(raven => {
            let embed = new RichEmbed()
                .setAuthor(`Raven`, `https://vignette1.wikia.nocookie.net/runescape2/images/d/d5/Raven_%28Prifddinas%29.png/revision/latest/scale-to-width-down/200?cb=20141004102306`, ``)
                .setTimestamp()
                .setDescription(`${raven.isSpawned ? 'There is currently a raven spawned in Prifddinas.' : `There is not a raven spawned in Prifddinas at this time.\n` +
                    `One will spawn in ${raven.daysUntilNext.toString().mdbold()} ${raven.daysUntilNext > 1 ? 'days'.mdbold() : 'day'.mdbold()}.`}`);
            if (raven.isSpawned) {
                const locations = `${process.env.SCAPERS}/api/raven?timestamp=${new Date().getTime()}`;
                embed.setImage(locations);
                message.embed(embed);
            }
            else {
                message.embed(embed);
            }
        }).catch(err => {
            console.log('err', err);
        });
    }
};