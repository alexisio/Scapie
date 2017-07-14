const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class WarbandsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'wiki',
            aliases: ['rsw'],
            group: 'community',
            memberName: 'wiki',
            description: 'Get relevant rs wiki data',
            examples: ['wiki Aftershock'],
        });
    }

    async run(message, args) {
        let api = `http://runescape.wikia.com/api/v1/Search/List?query=${args.trim()}&limit=5&minArticleQuality=10&batch=1&namespaces=0%2C14`;
        util.request.remoteApi(api).then(result => {
            message.embed(this.createEmbed(args.trim(), result));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(query, result) {
        let embed = new RichEmbed()
            .setAuthor(`RuneScape Wiki`, ``)
            .setTimestamp()
            .setDescription(`Top 5 results for the search term ${query.mdbold()}`);
        result.items.forEach(article => {
            embed.addField(article.title,`${article.url}\n${article.snippet.replace(/<(?:.|\n)*?>/gm, '').replace(/&hellip;/g, '...').trim()}`)
        });
        return embed;
    }
};