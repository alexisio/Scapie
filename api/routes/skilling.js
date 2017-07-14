const express = require('express'),
    router = express.Router(),
    rsapi = require('rs-api'),
    moment = require('moment');

module.exports = function (jwtCheck, adminCheck) {
    router.get('/:type', (req, res) => {
        if (typeof req.params.type !== 'undefined') {
            let type = req.params.type;
            let call = rsapi.rs.skilling[type];
            let funcType;
            if (typeof call['getCurrent'] !== 'undefined') {
                funcType = 'getCurrent';
            }
            else {
                funcType = 'getCall';
            }
            call[funcType]().then(info => {
                return res.send(info);
            }).catch(err => {
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a type name to check'});
        }
    });

    return router;
};