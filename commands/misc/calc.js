const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class CalcCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'calc',
            aliases: [],
            group: 'misc',
            memberName: 'calc',
            description: 'Do simple arithmetic',
            examples: ['calc 10*10'],
        });
    }

    async run(message, args) {
        message.say(eval(args.replace(/[^-()\d/*+.]/g, '')).toLocaleString());
    }
};