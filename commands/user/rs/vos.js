var Discord = require('discord.js'),
    utilities = require('./../../../utils/index');


function VoS() {
    var space = ' ';
    var linebreak = '\n';

    this.usage = '!vos [<details>]';
    this.examples = ['!vos', '!vos details']
    this.alias = [];
    this.description = 'Get the current Voice of Seren. Optional to add details';
    this.type = 'skilling';
    this.enabled = true;
    this.run = function (bot, message, suffix) {
        return new Promise(function (resolve, reject) {
            var apiRequest = '/api/scapers/skilling/vos';
            utilities.request.api(apiRequest).then(function (vos) {
                resolve({command: 'vos', value: format(vos, suffix), sendType: utilities.sendType.EMBED});
            }).catch(function (err) {
                reject(err);
            });
        });
    }


    var format = function (data, details) {
        var vos = '';
        for (var district in districts) {
            if (data.vos.includes(district)) {
                vos += vos.length > 0 ? '-' + district : district;
            }
        }

        var embed = new Discord.RichEmbed();
        embed.setAuthor('Voice of Seren', 'http://vignette2.wikia.nocookie.net/runescape2/images/5/50/Seren_%28with_Eluned%29_chathead.png/revision/latest?cb=20151030153838', '');
        embed.setThumbnail('http://alexisio.github.io/Runescape/images/vos/' + vos + '.png');
        var one = vos.split('-')[0];
        var two = vos.split('-')[1];
        embed.addField(utilities.markdown.bold('Active'), one + ' and ' + two, true);
        if (details.trim().length > 0) {
            var bonusOne = '';
            districts[one].forEach(function (bonus) {
                bonusOne += bonus + linebreak + linebreak;
            });
            var bonusTwo = '';
            districts[two].forEach(function (bonus) {
                bonusTwo += bonus + linebreak + linebreak;
            });
            var bonusAll = '';
            districts['AllClans'].forEach(function (bonus) {
                bonusAll += bonus + linebreak + linebreak;
            });

            embed.addField(utilities.markdown.bold(one + ' Effects'), bonusOne);
            embed.addField(utilities.markdown.bold(two + ' Effects'), bonusTwo);
            embed.addField(utilities.markdown.bold('Generic Effects'), bonusAll);
        }

        embed.setFooter('Scapie', 'https://alexisio.github.com/Runescape/images/logos/Scapie_Flat.png');
        return embed;

    };

    var districts = {
        'Amlodd': [
            '20% more base Summoning XP from making pouches and scrolls, as well as creating 12 scrolls per pouch instead of the regular 10.',
            '20% more base Divination XP from converting shadow cores, as well as a chance of chronicles spawning after killing a truthful, blissful or manifest shadow.'
        ],
        'Cadarn': [
            'When defeating a Cadarn ranger or magus, 200 Ranged or Magic experience, respectively, is gained, regardless of the combat style used.'
        ],
        'Crwys': [
            '20% more base Woodcutting XP from cutting ivy, magic logs, and yew logs. All bird\'s nest drops are replaced with crystal geode, though this does not require 94 woodcutting.',
            '20% more base Farming XP from planting, checking, and harvesting from the bush, herb and elder tree patches. Crops in the district also have a chance of skipping growth stages.',
            'A chance to spawn a Guthixian butterfly when harvesting from or checking the health of crops in the district.'
        ],
        'Hefin': [
            '20% more base Agility XP whilst training agility on the Hefin Agility Course. The rate at which velocity is gained on the agility course is doubled.',
            'While doing laps on the Hefin Agility Course, an additional 25% of base Agility experience is gained in the Prayer skill for each action performed. Experience boosts, such as bonus experience and the first age set do work.',
            'The collector\'s insignia will not lose charge.',
            '20% more base Prayer XP from cleansing the Corrupted Seren Stone.',
            'Increased chance of the window and light creature shortcuts appearing on the Hefin Agility Course.'
        ],
        'Iorwerth': [
            'When defeating an Iorwerth guard or scout, 100 Attack experience and 100 Strength experience are gained, regardless of the combat style used.',
            'A better chance to get Prifddinas-related items from the crystal chest, including corrupted ore, crystal tree blossoms and crystal motherlode shards.',
            'When defeating monsters in the Rush of Blood D&D, you will gain some Slayer experience from ALL of the monsters.'
        ],
        'Ithell': [
            '20% more base Crafting and Construction XP from training using the harps. The harps have a significantly lower chance of losing tune while playing.',
            '20% more base Crafting XP from crafting crystal flasks.',
            'Sawmill operator shop stock doubles. It will replenish if it is empty when voice takes effect.'
        ],
        'Meilyr': [
            '0% more base Farming XP from planting and checking the fruit tree patch, and from checking the harmony pillars. Trees planted in the district will have a chance of skipping growth stages.',
            '20% more Herblore XP from making combination potions.'
        ],
        'Trahaearn': [
            '20% more base Mining XP ores, gems, and Seren Stones in the district. Mining any type of ore has a chance of yielding corrupted ore (this occurs at any mining level, and will count towards the 100 needed to unlock the "of the Trahaearn" title.)',
            'Ore rocks have a chance of changing into harmonised rocks temporarily, allowing the rocks to be mined without running out of ore (similar to the concentrated ore in the Living Rock Caverns).',
            'Mining harmonised coal rocks will count towards "Concentrated Coal Deposits" tasks.',
            '20% more base Smithing XP from smelting or smithing any items in the furnaces or on the anvils, except for protean bars. Smelting corrupted ore has a 2-in-9 chance of producing swamp tar.',
            '20% more base Farming XP from planting and checking the tree patch, as well as a chance of the tree skipping growth stages.'],
        'AllClans': [
            '20% extra base experience from pickpocketing the respective workers.',
            'An increased chance to find Golden rocks in the respective clan\'s skill.',
            'A chance for a crystal impling to spawn at the herald of one of the affected clans (this can happen multiple times during the illumination).',
        ]
    }
}

module.exports = new VoS();
