var stats = require('./stats'),
    vorago = require('./vorago'),
    rots = require('./rots'),
    araxxor = require('./araxxor'),
    viswax = require('./viswax'),
    warbands = require('./warbands'),
    spotlight = require('./spotlight'),
    vos = require('./vos'),
    portables = require('./portables'),
    alog = require('./alog'),
    price = require('./price'),
    calc = require('./calc'),
    news = require('./news'),
    uptime = require('./uptime'),
    ping = require('./ping');

function User() {
    this.stats = stats;
    this.vorago = vorago;
    this.rots = rots;
    this.araxxor = araxxor;
    this.viswax = viswax;
    this.warbands = warbands;
    this.spotlight = spotlight;
    this.vos = vos;
    this.portables = portables;
    this.alog = alog;
    this.price = price;
    this.calc = calc;
    this.news = news;
    this.uptime = uptime;
    this.ping = ping;
}

module.exports = new User();
