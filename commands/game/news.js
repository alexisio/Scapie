const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class NewsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'news',
            aliases: [],
            group: 'game',
            memberName: 'news',
            description: 'Get most recent news event',
            examples: ['news'],
        });
    }

    async run(message, args) {
        let api = `/api/news`;
        util.request.api(api).then(result => {
            message.say(result.items[0].link);
        }).catch(err => {
            console.log('err', err);
        });
    }
};