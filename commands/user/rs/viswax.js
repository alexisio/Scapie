var Discord = require('discord.js'),
    utilities = require('./../../../utils/index');

function Viswax() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!viswax';
    this.examples = ['!viswax']
    this.alias = [];
    this.description = 'Get the current vis wax combo per Vis Wax FC';
    this.type = 'distraction';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/scapers/distractions/viswax';
            utilities.request.api(apiRequest).then(function (vis) {
                resolve({command: 'viswax', value: format(bot, vis), sendType: utilities.sendType.EMBED});
            }).catch(function(err) { reject(err); });
        });
    };

    var format = function (bot, data) {
        var embed = new Discord.RichEmbed();
        embed.setAuthor('Vis Wax FC v4', 'https://secure.runescape.com/m=avatar-rs/SugarsTiamat/chat.png', '');
        embed.setThumbnail('http://vignette1.wikia.nocookie.net/runescape2/images/4/49/Vis_wax_detail.png/revision/latest/scale-to-width-down/150?cb=20140915115106');
        embed.addField(utilities.markdown.bold('First Rune'), data.slot1.replace(/\(/g, ' ('));
        embed.addField(utilities.markdown.bold('Second Rune'), data.slot2.replace(/\(/g, ' (').replace(/\) /g, ')\n').replace(/,/g, ', '));
        embed.setFooter('Scapie - ' + data.lastUpdate, 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        return embed;
    };
}

module.exports = new Viswax();
