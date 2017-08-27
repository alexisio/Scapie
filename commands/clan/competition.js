const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class CompetitionCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'competition',
            aliases: ['comp'],
            group: 'clan',
            memberName: 'competition',
            description: 'Get standings for in progress competition',
            examples: ['competition'],
        });
    }

    async run(message, args) {
        const clan = 'maximized';
        util.request.remoteApi(`${process.env.SCAPERS}/api/competitions/clan/${clan}/inprogress`).then(competition => {
            if (competition) {
                util.request.remoteApi(`${process.env.SCAPERS}/api/competitions/${competition._id}/standings`).then(standings => {
                    message.embed(this.createEmbed(clan, competition, standings));
                });
            }
            else {
                message.reply('No inprogress competition');
            }
        }).catch(err => {
            console.log('err', err);
            message.reply('No inprogress competition');
        });
    }

    createEmbed(clan, competition, standings) {
        let embed = new RichEmbed()
            .setAuthor(`${competition.name.toTitleCase()}`, ``)
            //.setTimestamp()
            .setFooter(`Last Update: ${new Date(competition.lastUpdate).toLocaleString()}`)
            .setThumbnail(`http://services.runescape.com/m=avatar-rs/${clan}/clanmotif.png`)
            .setTitle('View on SCAPERS')
            .setURL(`https://scapers.herokuapp.com/competitions/${competition._id}`)
        let standingsStr = '';
        const gains = this.flattenArray(standings);
        const skill = competition.skills[0].toLowerCase().trim();
        gains.sortExpBySkill(`-${skill}`);
        gains.forEach((standing, i) => {
            standingsStr += standing.display ? `${i + 1}) ${standing.display.toTitleCase().mdbold()} has gained ${standing[skill].exp ? standing[skill].exp.toLocaleString().mdbold() : '0'} XP\n` : '';
        });
        embed.setDescription(standingsStr);
        return embed;
    }

    flattenArray(standings) {
        let flattened = [];
        standings.forEach(standing => {
           let flat = standing.stats;
           flat['display'] = standing.player ? standing.player.display.toTitleCase() : null;
           if (flat.display !== null) {
               flattened.push(flat);
           }
        });
        return flattened;
    }
};