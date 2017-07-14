const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils'),
    moment = require('moment');

module.exports = class PriceCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'price',
            aliases: ['ge'],
            group: 'game',
            memberName: 'price',
            description: 'Get price of item',
            examples: ['price noxious longbow', 'ge staff of sliske'],
        });
    }

    async run(message, args) {
        let api = `/api/ge/${args.trim().replace(/ /g, '%20')}`;
        console.log(api);
        util.request.api(api).then(result => {
            message.embed(this.createEmbed(result));
        }).catch(err => {
            console.log('err', err);
        });
    }

    createEmbed(result) {
        console.log(result);

        let embed = new RichEmbed()
            .setAuthor(`${result.item}`,``, '')
            .setTimestamp()
            .setThumbnail(`${result.information.item.icon_large}`)
            .setDescription(`${result.examine.replace(/\\/g,`'`)}`);

        embed.addField('Price',`${result.price.toLocaleString() + ' GP'}\nLimit ${result.limit == 0 ? 'N/A' : result.limit.toLocaleString()}`, true);
        //embed.addField('High Alch',`${result.value.toLocaleString()} ${result.value - result.price < 0 ? ':x:' : ':white_check_mark:'}`, true);
        let change = result.price - result.last;
        embed.addField('Change', `${change.toLocaleString() + ' GP '} ${Number(change) == 0 ? ':left_right_arrow:' : Number(change) > 0 ? ':arrow_up:' : ':arrow_down:'}`, true);
        return embed;
    }
};