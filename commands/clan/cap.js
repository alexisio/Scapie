const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class CapCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'cap',
            aliases: [],
            group: 'clan',
            memberName: 'cap',
            description: 'Add a cap for the citadel',
            examples: ['cap'],
            args: [
                {
                    key: 'member',
                    prompt: 'Add a cap for who?',
                    type: 'string'
                },
                {
                    key: 'resources',
                    prompt: 'How many resources were collected?',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, args) {
        const { member, resources } = args;
        util.request.remoteApi(`${process.env.SCAPERS}/api/caps/maximized`, 'POST', {"username": member.trim(), "resources": resources}).then(cap => {
            message.embed(this.createEmbed(cap));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(cap) {
        let embed = new RichEmbed()
            .setAuthor(cap.clan.name.toTitleCase(), ``)
            .setTimestamp();
            //.setThumbnail(`http://services.runescape.com/m=avatar-rs/${clan}/clanmotif.png`)
        embed.setDescription(`Cap recorded for ${cap.player.display.mdbold()} (full: ${cap.full})`);
        return embed;
    }
};
