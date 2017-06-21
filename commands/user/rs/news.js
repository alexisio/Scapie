var Discord = require('discord.js'),
    numeral = require('numeral'),
    utilities = require('./../../../utils/index');

function News() {
    var space = ' ';
    var linebreak = '\n';


    this.usage = '!news';
    this.examples = ['!news'];
    this.alias = [];
    this.description = 'Get recent news.';
    this.type = 'lookup';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            utilities.request.api('/api/rs/news').then(function (news) {
                resolve({command: 'news', value: format(news), sendType: utilities.sendType.STRING});
            }).catch(function (err) {
                reject({command: 'news', value: 'Unable to get the recent news articles', sendType: utilities.sendType.STRING});
            });
        });
    };

    var format = function(news) {
        return news.items[0].link;
    }
}

module.exports = new News();
