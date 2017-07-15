const express = require('express'),
    router = express.Router(),
    rsapi = require('rs-api'),
    moment = require('moment');

module.exports = function (jwtCheck, adminCheck) {
    router.get('/spotlight', (req, res) => {
        rsapi.rs.distraction.spotlight.getRotation().then(rotations => {
            return res.send(rotations);
        }).catch(err => {
            return res.status(404).send({message: err.message});
        });
    });

    router.get('/spotlight/:lookup', (req, res) => {
        if (typeof req.params.lookup !== 'undefined') {
            let lookup = req.params.lookup;
            console.log(lookup);
            let funcType = '';
            if (moment(lookup, 'MM-DD-YYYY').isValid()) {
                funcType = 'getRotation';
            }
            else {
                funcType = 'getMinigameNext';
            }
            console.log(funcType);
            if (typeof rsapi.rs.distraction.spotlight[funcType] === 'function') {
                rsapi.rs.distraction.spotlight[funcType](lookup).then(rotations => {
                    console.log(rotations);
                    return res.send(rotations);
                }).catch(err => {
                    return res.status(404).send({message: err.message});
                });
            }
            else {
                return res.status(500).send({message: `Cannot find function ${funcType}`});
            }
        }
        else {
            return res.status(500).send({message: 'Must send in a lookup to check'});
        }
    });

    router.get('/warbands', (req, res) => {
        rsapi.rs.distraction.warbands.getNext().then(next => {
            return res.send(next);
        }).catch(err => {
            return res.status(404).send({message: err.message});
        });
    });

    router.get('/viswax',(req, res) => {
        rsapi.rs.distraction.viswax.getCurrent().then(vis => {
            return res.send(vis);
        }).catch(err => {
            return res.status(404).send({message: err.message});
        });
    });

    router.get('/circus',(req, res) => {
        rsapi.rs.distraction.circus.getRotation().then(circus => {
            return res.send(circus);
        }).catch(err => {
            return res.status(404).send({message: err.message});
        });
    });

    return router;
};