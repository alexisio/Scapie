const express = require('express'),
    router = express.Router(),
    rsapi = require('rs-api');

module.exports = function(jwtCheck, adminCheck) {
    router.get('/:username/stats', (req, res) => {
        if (typeof req.params.username !== 'undefined') {
            let username = req.params.username;
            rsapi.rs.player.hiscores(username).then(function(stats) {
                return res.send(stats);
            }).catch(function(err) {
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a display name to check'});
        }
    });

    router.get('/:username/stats/:stat', (req, res) => {
        if (typeof req.params.username !== 'undefined' && typeof req.params.stat !== 'undefined') {
            let username = req.params.username;
            let stat = req.params.stat;
            rsapi.rs.player.hiscores(username).then(function(stats) {
                let lookup = typeof skillAlias[stat] !== 'undefined' ? skillAlias[stat] : stat;
                let obj = {};
                obj['username'] = username;
                obj['skill'] = lookup;
                obj['detail'] = stats.skills[lookup];
                return res.send(obj);
            }).catch(function(err) {
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a display name to check'});
        }
    });

    router.get('/:username/details', (req, res) => {
        if (typeof req.params.username !== 'undefined') {
            let username = req.params.username;
            rsapi.rs.player.details(username).then(function(details) {
                return res.send(details);
            }).catch(function(err) {
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a display name to check'});
        }
    });

    router.get('/:username/profile', (req, res) => {
        if (typeof req.params.username !== 'undefined') {
            let username = req.params.username;
            rsapi.rs.player.profile(username).then(function(profile) {
                return res.send(profile);
            }).catch(function(err) {
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a display name to check'});
        }
    });

    router.get('/:username/events', (req, res) => {
        if (typeof req.params.username !== 'undefined') {
            let username = req.params.username;
            rsapi.rs.player.events(username).then(function(details) {
                return res.send(details);
            }).catch(function(err) {
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a display name to check'});
        }
    });

    var skillAlias = {
        'att': 'attack',
        'def': 'defence',
        'str': 'strength',
        'hp': 'hitpoints',
        'range': 'ranged',
        'pray': 'prayer',
        'mage': 'magic',
        'cook': 'cooking',
        'wc': 'woodcutting',
        'fletch': 'fletching',
        'fish': 'fishing',
        'fm': 'firemaking',
        'craft': 'crafting',
        'smith': 'smithing',
        'mine': 'mining',
        'herb': 'herblore',
        'agil': 'agility',
        'thieve': 'thieving',
        'slay': 'slayer',
        'farm': 'farming',
        'rc': 'runecrafting',
        'runespanning': 'runecrafting',
        'runespan': 'runecrafting',
        'hunt': 'hunter',
        'con': 'construction',
        'cons': 'construction',
        'sum': 'summoning',
        'dg': 'dungeoneering',
        'dung': 'dungeoneering',
        'div': 'divination',
        'inv': 'invention'
    };
    return router;
};