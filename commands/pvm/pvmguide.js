const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment'),
    async = require('async');

module.exports = class PvMGuideCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'pvmguide',
            aliases: ['pvm', 'rotations'],
            group: 'pvm',
            memberName: 'pvmguide',
            description: 'Get current PvM rotations',
            examples: ['pvmguide'],
        });
    }

    async run(message, args) {
        var list = ['rots', 'vorago', 'araxxor'];
        var calls = [];
        list.forEach(name => {
            calls.push(cb => {
                util.request.api(`/api/pvm/${name}`).then(rotation => {
                    cb(null, rotation);
                })
            });
        });

        async.parallel(calls, function (err, result) {
            let assets = [
                'http://vignette3.wikia.nocookie.net/runescape2/images/7/7d/Karil_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015446',
                'http://vignette4.wikia.nocookie.net/runescape2/images/c/cd/Ahrim_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015444',
                'http://vignette2.wikia.nocookie.net/runescape2/images/1/17/Torag_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015446',
                'http://vignette3.wikia.nocookie.net/runescape2/images/f/fa/Verac_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126151047',
                'http://vignette1.wikia.nocookie.net/runescape2/images/8/80/Guthan_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015445',
                'http://vignette2.wikia.nocookie.net/runescape2/images/c/c6/Dharok_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015445',
                'https://vignette2.wikia.nocookie.net/runescape2/images/2/2b/Nex_%28Angel_of_Death%29.png/revision/latest/scale-to-width-down/250?cb=20170130192323',
                'https://vignette1.wikia.nocookie.net/runescape2/images/f/f2/Araxxor.png/revision/latest/scale-to-width-down/250?cb=20140729225744'
            ];
            let embed = new RichEmbed()
                .setAuthor('PvM Guide')
                .setTimestamp()
                .setThumbnail(assets[Math.floor(Math.random() * 8)])
                .setThumbnail('')
            result.forEach(boss => {
                let nextStart = new Date(boss[1].startDate);
                nextStart.setHours(0, 0, 0, 0);
                let diff = new moment.duration(Math.abs(nextStart - new Date()));
                let dhm = `${diff.days()}d ${diff.hours()}h ${diff.minutes()}m`;
                if (typeof boss[0].rotation.west != 'undefined') {
                    embed.addField('Rise of the Six', `${'East:'.mdbold()}\t  ${boss[0].rotation.east}\n${'West:'.mdbold()}\t${boss[0].rotation.west}`);
                }
                else if (typeof boss[0].rotation.normal != 'undefined') {
                    embed.addField('Vorago', `${'Normal'.mdunderline()}\n${boss[0].rotation.normal.mdbold()}\n` +
                        `${'Hardmode'.mdunderline()}\n${'East:'.mdbold()}\t\t${boss[0].rotation.hard.east}\n${'West:'.mdbold()}\t  ${boss[0].rotation.hard.west}\n${'Unlock:'.mdbold()}   ${boss[0].rotation.hard.unlock}\n` +
                        `${'For:'.mdbold()} ${dhm}`)
                }
                else if (typeof boss[0].rotation.open != 'undefined') {
                    embed.addField('Araxxor', `${'Open:'.mdbold()}\t   ${boss[0].rotation.open[0].characteristic} and ${boss[0].rotation.open[1].characteristic}\n` +
                                              `${'Closed:'.mdbold()}\t ${boss[0].rotation.closed.characteristic}\n${'For:'.mdbold()} ${dhm}`)
                }
            });

            message.embed(embed);

        });
    }
};