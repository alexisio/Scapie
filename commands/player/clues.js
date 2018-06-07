const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils');

module.exports = class CluesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'clues',
            aliases: ['scrolls'],
            group: 'player',
            memberName: 'clues',
            description: 'Get players clue count',
            examples: ['clues sync'],
        });
    }

    async run(message, args) {
        let username = args;

        let statsApi = `/api/players/${username}/stats`;

        util.request.api(statsApi).then(hiscore => {
            this.createEmbed(hiscore).then(embed => {
                message.embed(embed);
            });
        }).catch(err => {
            console.log('err', err);
        })

    }

    async createEmbed(hiscores) {
        if (!hiscores || !hiscores.name) {
            embed.setAuthor('Scapie');
            return embed.setDescription('Error getting player profile');
        }

        var ava = `https://secure.runescape.com/m=avatar-rs/'${hiscores.name.trim().replace(/ /g, '%20')}/chat.png?timestamp=${new Date().getTime()}`;
        let embed = new RichEmbed()
            .setAuthor(`${hiscores.name}'s clue scroll count`)
            .setTimestamp()
            .setThumbnail(ava)
            .setDescription(
                `${"Easy:"} ${hiscores.activities.easy_clue_scrolls.score}\n` +
                `${"Medium:"} ${hiscores.activities.medium_clue_scrolls.score}\n` +
                `${"Hard:"} ${hiscores.activities.hard_clue_scrolls.score}\n` +
                `${"Elite:"} ${hiscores.activities.elite_clue_scrolls.score}\n` +
                `${"Master:"} ${hiscores.activities.master_clue_scrolls.score}`
            );

        return embed;
    }
};