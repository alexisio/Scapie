const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class NemiCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'nemi',
            aliases: ['forest'],
            group: 'minigames',
            memberName: 'nemi',
            description: 'Get nemi forest map',
            examples: ['nemi'],
        });
    }

    async run(message, args) {
        util.request.remoteApi(`https://www.reddit.com/r/nemiforest/new.json?sort=new`).then(result => {
            message.embed(this.createEmbed(result));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result) {
        const post = result.data.children[0];
        const flair = post.data.link_flair_text;
        let embed = new RichEmbed()
            .setAuthor(post.data.author, ``)
            .setTimestamp()
            .setDescription(`${flair !== null ? post.data.link_flair_text.mdbold().toUpperCase() + ' ': ''}${post.data.title}`)
            .setImage(`https://preview.redd.it/s0znpnemrsz21.png?auto=webp&s=f751b0994d9b80794cb4102d354f5ba1c72699e4`);
            // `${post.data.preview.images[0].source.url}`
        return embed;
    }
};
