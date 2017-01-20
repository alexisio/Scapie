var user = require('./user'),
    Help = require('./user/help');

function Commands() {
    this.user = user;
    this.mod = {hi: 'yo'};
    this.help = new Help(user, {hi: 'yo'});
}

module.exports = new Commands();
