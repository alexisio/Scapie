const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment'),
    rwc = require('random-weighted-choice');

module.exports = class RandomCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'randomizer',
            aliases: ['random'],
            group: 'misc',
            memberName: 'randomizer',
            description: 'Uses weights to select a random result from a CSV',
            examples: ['randomizer alex=10,billy=3'],
        });
    }

    async run(message, args) {
        let input = args.split(',');
        let table = [];
        input.forEach(function (d) {
            if (d.includes('=')) {
                let vals = d.split('=');
                let weight = {weight: parseInt(vals[1].trim()), id: vals[0].trim()};
                table.push(weight);
            }
        });
        let chosen = rwc(table);
        message.say(`The winner is: ${chosen.toTitleCase().mdbold()}`);
    }
};