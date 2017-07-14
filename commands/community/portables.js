const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class PortablesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'portables',
            aliases: ['portable'],
            group: 'community',
            memberName: 'portables',
            description: 'Get portables hosting locations',
            examples: ['portables', 'portables abbr'],
        });
    }

    async run(message, args) {
        let api = `/api/skilling/portables`;
        util.request.api(api).then(result => {
            message.embed(this.createEmbed(result, args.trim()));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result, abbr) {
        let embed = new RichEmbed()
            .setAuthor(`Portables`, 'http://vignette1.wikia.nocookie.net/runescape2/images/2/2b/Portable_skilling_pack_detail.png/revision/latest?cb=20150220002222', '')
            .setThumbnail('https://pbs.twimg.com/profile_images/773927684132970496/VUgCCtBY.jpg')
            .setTimestamp()

        var calls = '';
        for (var type in result) {
            if (type !== 'abbrev' && type !== 'update') {
                calls += `${type.toTitleCase().mdbold()}: ${result[type]}\n`;
            }
        }
        embed.setDescription(calls);
        if (abbr.length > 0) {
            embed.addField('Abbreviations', result.abbrev.replace(/\| /g, '\n').trim())
        }
        return embed;
    }
};