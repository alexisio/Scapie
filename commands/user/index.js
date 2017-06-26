var stats = require('./rs/stats'),
    vorago = require('./rs/vorago'),
    rots = require('./rs/rots'),
    araxxor = require('./rs/araxxor'),
    viswax = require('./rs/viswax'),
    warbands = require('./rs/warbands'),
    spotlight = require('./rs/spotlight'),
    vos = require('./rs/vos'),
    portables = require('./rs/portables'),
    alog = require('./rs/alog'),
    price = require('./rs/price'),
    calc = require('./misc/calc'),
    news = require('./rs/news'),
    uptime = require('./uptime'),
    ping = require('./ping'),
    player = require('./rs/player'),
    perk = require('./rs/perk'),
    randomizer = require('./misc/randomizer');

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
    this.player = player;
    this.perk = perk;
    this.randomizer = randomizer;
    this.set = require('./auth/set');
    this.verify = require('./auth/verify');
    this.me = require('./auth/me');
    this.members = require('./clan/members');
    this.activity = require('./clan/activity');
}

module.exports = new User();
