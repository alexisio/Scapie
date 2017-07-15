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
        let spawned = false;
        let daysUntilNext = 0;
        let found = (((Math.floor((Date.now() / 1000) / (24 * 60 * 60))) + 7) % 13);

        if (found < 1) {
            daysUntilNext = 1 - found;
            spawned = true;
        }
        else {
            daysUntilNext = 13 - found;
            spawned = false;
        }

        let embed = new RichEmbed()
            .setAuthor(`Raven`, ``, ``)
            .setThumbnail(`https://vignette1.wikia.nocookie.net/runescape2/images/d/d5/Raven_%28Prifddinas%29.png/revision/latest/scale-to-width-down/200?cb=20141004102306`)
            .setTimestamp()
            .setDescription(`${spawned ? 'There is currently a raven spawned in Prifddinas.' : `There is not a raven spawned in Prifddinas at this time.\n` +
                `One will spawn in ${daysUntilNext.toString().mdbold()} ${daysUntilNext > 1 ? 'days'.mdbold() : 'day'.mdbold()}.`}`);

        message.embed(embed);
    }
};