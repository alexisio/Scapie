const express = require('express'),
    router = express.Router(),
    rsapi = require('rs-api');

module.exports = function(jwtCheck, adminCheck) {
    router.get('/:clan/members', (req, res) => {
        if (typeof req.params.clan !== 'undefined') {
            let clanName = req.params.clan;
            rsapi.rs.clan.members(clanName).then(function(clan) {
                return res.send(clan);
            }).catch(function(err) {
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a clan to look up'});
        }
    });
    return router;
};