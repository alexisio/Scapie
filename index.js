var Discord = require('discord.js'),
    Commands = require('./commands'),
    Settings = require('./configs/settings.json'),
    bot = new Discord.Client();

// bot login
var token = Settings.auth.prodToken;
if (process.env.NODE_ENV === 'development') {
    console.log('logging in with dev token');
    token = Settings.auth.devToken;
}
bot.login(token);

bot.on('ready', function () {
    console.log('I am ready');
});

bot.on('guildCreate', function(guild) {
    console.log(guild);
})

bot.on('message', function (msg) {
    var message = msg.content.toLowerCase();
    if (message.startsWith('!')) {
        // permissions
        var user = msg.author;
        var permissions = msg.channel.permissionsFor(user);
        var canManage = permissions.hasPermission('MANAGE_CHANNELS', true);

        // get the guild making the request and load their config
        var guildId = msg.guild.id;

        // get command input
        var endOfLine = message.indexOf(' ');
        var lookup = message.substring(1, endOfLine > 0 ? endOfLine : message.length);
        var suffix = message.substring(lookup.length + 1, message.length);

        var aliases = Commands.help.getAliases();

        // get and run command
        var command = typeof Commands.user[lookup] !== 'undefined' ? Commands.user[lookup] : Commands.user[aliases[lookup]];
        if (typeof command === 'undefined') {
            command = typeof Commands.mod[lookup] !== 'undefined' ? Commands.mod[lookup] : Commands.mod[aliases[lookup]];
        }

        if (typeof command === 'undefined' && lookup.toLowerCase().trim() == 'help') {
            command = Commands.help;
        }

        if (command && command.enabled) {
            command.run(bot, msg, suffix).then(function (res) {
                if (res.sendType == 'sendEmbed') {
                    res.value.setColor('#4ac5df');
                }
                msg.channel[res.sendType](res.value);
            }).catch(function (err) {
                if (err.value && err.command) {
                    msg.channel[err.sendType](err.value);
                }
                else {
                    console.log(err);
                }
            });
        }
    }
});

setInterval(function () {
    var list = [
        { status: 'online', game: { name: 'with Araxxor' } },
        { status: 'online', game: { name: 'with the Barrows Bros' } },
        { status: 'online', game: { name: 'with Yakamaru' } },
        { status: 'online', game: { name: 'with Telos' } },
        { status: 'online', game: { name: 'with Nex' } },
        { status: 'online', game: { name: 'with the Angel of Death' } },
        { status: 'online', game: { name: 'Heist' } },
        { status: 'online', game: { name: 'Castle Wars' } },
        { status: 'online', game: { name: 'in the Max Guild' } }
    ];
    var index = Math.floor(Math.random() * list.length);
    var presence = list[index];
    bot.user.setPresence(presence);
}, 300000);