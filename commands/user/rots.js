var Discord = require('discord.js'),
    utilities = require('./../../utils');

function RoTS() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!rots [<lookupDate>]';
    this.examples = ['!rots', '!rots 10/10/2020']
    this.alias = [];
    this.description = 'Get the RoTS rotation for today or specified day';
    this.type = 'rotation';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/scapers/rotations/rots';
            var future = false;
            if (suffix.trim().length > 1) {
                future = true;
                apiRequest += '/' + suffix.trim().replace(/\//g, '-');
            }

            utilities.request.api(apiRequest).then(function (rotations) {
                resolve({command: 'rots', value: format(bot, rotations, future), sendType: utilities.sendType.EMBED});
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    var format = function (bot, data, future) {
        var embed = new Discord.RichEmbed();
        var rotation = data[0];
        var next = data[1];
        var bobbled = [
            'http://vignette3.wikia.nocookie.net/runescape2/images/7/7d/Karil_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015446',
            'http://vignette4.wikia.nocookie.net/runescape2/images/c/cd/Ahrim_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015444',
            'http://vignette2.wikia.nocookie.net/runescape2/images/1/17/Torag_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015446',
            'http://vignette3.wikia.nocookie.net/runescape2/images/f/fa/Verac_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126151047',
            'http://vignette1.wikia.nocookie.net/runescape2/images/8/80/Guthan_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015445',
            'http://vignette2.wikia.nocookie.net/runescape2/images/c/c6/Dharok_the_Bobbled_pet.png/revision/latest/scale-to-width-down/150?cb=20140126015445'
        ];
        embed.setAuthor('Rise of the Six', bobbled[Math.floor(Math.random() * 6)], '');

        var todayData = utilities.markdown.bold('East:\t  ') + rotation.rotation.east.replace(/ /g, '').replace(/-/g, ' - ') + linebreak +
            utilities.markdown.bold('West:\t') + rotation.rotation.west.replace(/ /g, '').replace(/-/g, ' - ');

        if (!future) {
            var tomorrowData = utilities.markdown.bold('East:\t  ') + next.rotation.east.replace(/ /g, '').replace(/-/g, ' - ') + linebreak +
                utilities.markdown.bold('West:\t') + next.rotation.west.replace(/ /g, '').replace(/-/g, ' - ');

            embed.addField(utilities.markdown.bold('Today'), todayData);
            embed.addField(utilities.markdown.bold('Tomorrow'), tomorrowData);
        }
        else {
            var s = utilities.dateToString(new Date(rotation.startDate));
            embed.addField(utilities.markdown.bold('Rotation on ' + s), todayData, true);
        }

        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        embed.setThumbnail(bobbled[Math.floor(Math.random() * 6)]);

        return embed;
    };
}

module.exports = new RoTS();
