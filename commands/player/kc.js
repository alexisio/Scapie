const Commando = require('discord.js-commando'),
    {RichEmbed} = require('discord.js'),
    util = require('./../../utils');

const nameMap = {
    'bankc': 'Bandos',
    'armkc': 'Aramdyl',
    'zamkc': 'Zamorak',
    'sarkc': 'Saradomin',
    'qbdkc': 'Queen Black Dragon',
    'nexkc': 'Nex',
    'kkxkc': 'Kalphite King',
    'kqxkc': 'Kalphite Queen',
    'kbdkc': 'King Black Dragon',
    'corkc': 'Corp',
    'dkskc': 'Dagannoth Kings',
    'jadkc': 'JAD',
    'kilkc': 'Kril Tsutsaroth',
    'molkc': 'Mole',
    'chakc': 'Chaos Elemental',
    'vorkc': 'Vorago',
    'arakc': 'Araxxi',
    'rotkc': 'Rise of the Six',
    'barkc': 'Barrows',
    'solkc': 'Solak',
    'telkc': 'Telos',
    'aodkc': 'Angel of Death',
    'tmakc': 'The Magister',
    'legkc': 'Legiones',
    'durkc': 'Bestmaster Durzag',
    'yakkc': 'Yakamaru',
    'vinkc': 'Vindicta',
    'twikc': 'Twin Furies',
    'helkc': 'Helwyr',
    'grekc': 'Gregorovic',
    'e11kc': 'Sanctum Guardian',
    'e12kc': 'Masuta',
    'e13kc': 'Seiryu',
    'e21kc': 'Astellarn',
    'e22kc': 'Verak Lith',
    'e23kc': 'Black Stone Dragon',
    'e31kc': 'Crassian Leviathan',
    'e32kc': 'Taraket',
    'e33kc': 'The Ambassador',
    /*'molhmkc': 1,
    'vorhmkc': 0,
    'banhmkc': 0,
    'armhmkc': 0,
    'zamhmkc': 0,
    'sarhmkc': 0,
    'vinhmkc': 0,
    'twihmkc': 0,
    'helhmkc': 0,
    'grehmkc': 0,
    'e11hmkc': 0,
    'e12hmkc': 0,
    'e13hmkc': 0,
    'e21hmkc': 0,
    'e22hmkc': 0,
    'e23hmkc': 0,
    'e31hmkc': 0,
    'e32hmkc': 0,
    'e33hmkc': 0*/
};

module.exports = class KCCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'kc',
            aliases: ['kills', 'boss'],
            group: 'player',
            memberName: 'kc',
            description: `Get boss killcounts from alt1's api`,
            examples: ['kc sync'],
        });
    }

    async run(message, args) {
        let username = args;

        util.request.remoteApi(`https://runeapps.org/node/pprofile/playerinfo`, `POST`, null, JSON.stringify(`{"name":"${username}"}`)).then(result => {
            const node = result.bossPoints;
            const bossNode = node[Object.keys(node)[0]];
            this.createEmbed(bossNode).then(embed => {
                return message.embed(embed);
            });
        }).catch(err => {
            console.log('err', err);
        });
    }

    async createEmbed(bosses) {
        let embed = new RichEmbed()
            .setTimestamp()
            .setFooter(`Last Update: ${new Date(bosses.time).toLocaleString()}`);
        let stringBosses = ``;
        Object.keys(bosses).forEach(function(key, index) {
           if (key !== 'time') {
               const name = nameMap[key];
               const kc = bosses[key];
               if (name && kc > 0) {
                   stringBosses += `${name}:`.mdbold() + ` ${kc}\n`;
               }
           }
        });
        embed.addField(`Killcounts`.mdbold(), stringBosses);
        return embed;
    }
};