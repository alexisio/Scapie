const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class AboutCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'about',
            aliases: [],
            group: 'misc',
            memberName: 'about',
            description: 'Get bot information',
            examples: ['about'],
        });
    }

    async run(message, args) {
        this.createEmbed().then(embed => {
            message.embed(embed);
        });
    }

    async createEmbed() {
        const d = moment.duration(this.client.uptime, 'milliseconds');
        let embed = new RichEmbed()
            .setTimestamp()
            .setAuthor('Scapie')
            .setDescription('Scapie is a discord bot that interacts with both the RuneScape API and the Scapers Clan Tracking Platform API. Scapers currently only supports the RuneScape clan Maximized.')
            .addField('Bot Stats',
                `Guild Count: ${Object.keys(this.client.guilds).length}\n` +
                `Ping: ${this.client.ping}\n` +
                `Uptime: ${d.asMonths() >= 1 ? d.asMonths().toFixed(0) + ' months' : '' } ${d.asDays() >= 1 ? d.asDays().toFixed(0) + ' days' : '' } ${d.asHours().toFixed(2)} hours`,
                false);
        return embed;
    }

    groupByDate(activities) {
        let groups = [];
        let group = [];
        let lastDate = activities[0].date.split(' ')[0];
        activities.forEach(activity => {
            let currentDate = activity.date.split(' ')[0];
            if (lastDate == currentDate) {
                group.push(activity);
            }
            else {
                groups.push(group);
                group = [];
                group.push(activity);
            }
            lastDate = currentDate;
        });
        groups.push(group);
        return groups;
    }
};
