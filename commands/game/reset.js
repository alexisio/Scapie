const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class ResetCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reset',
            aliases: [],
            group: 'game',
            memberName: 'reset',
            description: 'Get time until next daily, weekly, and monthly game reset',
            examples: ['reset'],
        });
    }

    async run(message, args) {
        let dailyReset = new moment().add(1, 'days').hour(0).minute(0).millisecond(0);
        let daily = new moment.duration(Math.abs(dailyReset - new Date()));
        let dailyHM = `${daily.hours()}h ${daily.minutes()}m`;

        let weeklyReset = new moment().day(10).hour(0).minute(0).millisecond(0);
        let weekly = new moment.duration(Math.abs(weeklyReset - new Date()));
        let weeklyDHM = `${weekly.days()}d ${weekly.hours()}h ${weekly.minutes()}m`;

        let monthlyReset = new moment().add(1, 'months').date(1).hour(0).minute(0).millisecond(0);
        let monthly = new moment.duration(Math.abs(monthlyReset - new Date()));
        let monthlyDHM = `${monthly.days()}d ${monthly.hours()}h ${monthly.minutes()}m`;

        let current = new moment();
        message.embed(this.createEmbed(current, dailyHM, weeklyDHM, monthlyDHM));
    }

    createEmbed(current, daily, weekly, monthly) {
        let embed = new RichEmbed()
            .setAuthor('Reset Information')
            .setDescription(`The current game date is ${current.toString().mdbold()}`)
            .setTimestamp()
            .addField('Daily', `Daily reset is in ${daily.toString().mdbold()}`)
            .addField('Weekly', `Weekly reset is in ${weekly.toString().mdbold()}`)
            .addField('Monthly', `Monthly reset is in ${monthly.toString().mdbold()}`)
        return embed;
    }
};