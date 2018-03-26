const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class ClanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'clan',
            aliases: [],
            group: 'clan',
            memberName: 'clan',
            description: 'Get clan details',
            examples: ['clan maximized'],
            args: [
                {
                    key: 'name',
                    prompt: 'Clan name to find',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, {name}) {
        name = name.trim();
        let api = `/api/clans/${name}/members`;
        util.request.api(api).then(result => {
            message.embed(this.createEmbed(result, name));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(members, name) {
        let embed = new RichEmbed()
            .setAuthor(name.toTitleCase(), ``)
            .setTimestamp()
            .setThumbnail(`http://services.runescape.com/m=avatar-rs/${name.replace(/ /g, '%20')}/clanmotif.png`);
        let xpCount = 0;
        for (let i in members) {
            let member = members[i];
            xpCount += member.exp;
        }
        let leaderRank = ['Owner', 'Deputy Owner', 'Overseer'];
        let clanLeaders = members.filter(m => { return leaderRank.includes(m.rank)});
        let leaders = [];
        let leadersStr = '';
        for (let i in clanLeaders) {
            let leader = clanLeaders[i];
            leaders.push(`${leader.player}`);
            leadersStr += `${leader.player}\n`
        }
        embed.addField(`Keys`, leadersStr, false);
        embed.addField(`Stats`, `Members: **${members.length}**\nTotal: **${xpCount.toLocaleString()} xp**\nAverage: **${Math.floor(xpCount / members.length).toLocaleString()} xp**`, false);
        return embed;
    }
};
