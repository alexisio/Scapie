var Discord = require('discord.js'),
    utilities = require('./../../../utils/index');

function Price() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!price <itemName>';
    this.examples = ['!price noxious longbow']
    this.alias = ['ge'];
    this.description = 'Get the item\'s current GE value';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/rs/ge/itemId/' + suffix.trim().replace(/ /g, '%20');
            utilities.request.api(apiRequest).then(function (items) {
                format(bot, items).then(function (res) {
                    resolve({command: 'price', value: res, sendType: utilities.sendType.EMBED});
                }).catch(console.error);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    var format = function (bot, data) {
        return new Promise(function (resolve, reject) {
            var embed = new Discord.RichEmbed();
            if (data.length == 1) {
                var item = data[0];
                pullFull(item.item.id, embed).then(function (em) {
                    embed = em;
                    embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
                    resolve(embed);
                });
            }
            else if (data.length > 1) {
                /*embed.setAuthor('Multiple Results', '', '');
                 embed.setThumbnail('http://vignette1.wikia.nocookie.net/runescape2/images/4/49/Vis_wax_detail.png/revision/latest/scale-to-width-down/150?cb=20140915115106');
                 embed.addField(utilities.markdown.bold('First Rune'), data.slot1);*/
            }
            //embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        });
    };

    var pullFull = function (id, embed) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/rs/ge/itemInformation/' + id;
            utilities.request.api(apiRequest).then(function (itemInfo) {
                var item = itemInfo.item;
                embed.setAuthor(item.name, 'http://vignette4.wikia.nocookie.net/runescape2/images/3/30/Coins_10000.png/revision/latest?cb=20160503051038', 'http://services.runescape.com/m=itemdb_rs/Noxious_scythe/viewitem?obj=' + id);
                embed.setDescription(item.description);
                embed.setThumbnail(item.icon_large);
                embed.addField(utilities.markdown.bold('Price'), item.current.price + ' GP ');
                var recentChange = item.today.price + ' GP ' + (item.today.trend == 'neutral' ? ':arrow_right:' : item.today.trend == 'positive' ? ':arrow_up:' : ':arrow_down:');
                embed.addField(utilities.markdown.bold('Change Last Update'), recentChange);

                resolve(embed);
            });
        }).catch(function (err) {
            reject(err);
        });
    }
}

module.exports = new Price();
