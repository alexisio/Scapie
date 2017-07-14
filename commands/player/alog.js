const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils');

module.exports = class AlogCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'alog',
            aliases: [],
            group: 'player',
            memberName: 'alog',
            description: 'Get players alog',
            examples: ['alog sync'],
        });
    }

    async run(message, args) {
        let username = args;

        let profileApi = `/api/players/${username}/profile`;

        util.request.api(profileApi).then(profile => {
            this.createEmbed(profile).then(embed => {
                message.embed(embed);
            });
        }).catch(err => {
            console.log('err', err);
        })

    }

    async createEmbed(profile) {
        let embed = new RichEmbed()
            .setTimestamp();
        if (!profile) {
            embed.setAuthor('Scapie');
            return embed.setDescription('Error getting player profile');
        }
        if (typeof profile.error !== 'undefined') {
            embed.setAuthor('Scapie');
            embed.setDescription('This player has privacy mode on.')
        }
        else if (typeof profile.activities !== 'undefined') {
            embed.setAuthor(`${profile.name}'s Achievements`, 'http://vignette3.wikia.nocookie.net/runescape2/images/8/88/RuneMetrics_icon.png/revision/latest?cb=20160421161211', `https://apps.runescape.com/runemetrics/app/overview/player/${profile.name.trim().replace(/ /g, '%20')}`);
            var ava = `https://secure.runescape.com/m=avatar-rs/'${profile.name.trim().replace(/ /g, '%20')}/chat.png?timestamp=${new Date().getTime()}`;
            embed.setThumbnail(ava);
            let dates = this.groupByDate(profile.activities.splice(0, Math.floor(profile.activities.length * .4)));
            dates.forEach(function (days) {
                let s = '';
                days.forEach(activity => {
                    s += `${activity.text.toLowerCase().indexOf('levelled') > -1 ? activity.details : activity.text} @ ${activity.date.split(' ')[1]}\n`
                });
                if (days && days.length > 0) {
                    embed.addField(`${days[0].date.split(' ')[0].replace(/-/g, ' ')}`, s, false);
                }
            });
        }
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