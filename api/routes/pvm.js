const express = require('express'),
    router = express.Router(),
    rsapi = require('rs-api');

module.exports = function (jwtCheck, adminCheck) {
    router.get('/:name', (req, res) => {
        if (typeof req.params.name !== 'undefined') {
            let name = req.params.name;
            rsapi.rs.boss[name].getRotation().then(rotations => {
                return res.send(rotations);
            }).catch(err => {
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a item name to check'});
        }
    });
    return router;
};