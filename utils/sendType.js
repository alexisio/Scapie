'use strict';

function SendTypes() {
    this.CODE = 'sendCode';
    this.EMBED = 'sendEmbed';
    this.ATTACHMENT = 'sendFile';
    this.STRING = 'sendMessage'
}

module.exports = new SendTypes();