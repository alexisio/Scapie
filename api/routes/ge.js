const express = require('express'),
    router = express.Router(),
    rsapi = require('rs-api'),
    async = require('async');

module.exports = function(jwtCheck, adminCheck) {
    router.get('/:name', (req, res) => {
        if (typeof req.params.name !== 'undefined') {
            let name = req.params.name;
            console.log(name);
            rsapi.rs.ge.getItem(name.trim()).then(item => {
                console.log('item',item);
                rsapi.rs.ge.itemInformation(Number(item.itemId)).then(info => {
                    item.information = info;
                    return res.send(item);
                }).catch(err => {
                    return res.status(404).send({message: err.message});
                })
            }).catch(err => {
                console.log('died getting item');
                return res.status(404).send({message: err.message});
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a item name to check'});
        }
    });

    router.get('/batch/:list', (req, res) => {
        if (typeof req.params.list !== 'undefined') {
            let list = req.params.list.split(',');
            var calls = [];
            list.forEach(name => {
                calls.push(function(cb) {
                    rsapi.rs.ge.getItem(name.trim()).then(item => {
                        cb(null,item);
                    }).catch(err => {
                        var item = {item: name, error: `Could not get information for ${name}`};
                        cb(null,item);
                    });
                });
            });

            async.parallel(calls, function(err, result) {
                if (err) return res.status(500).send(err);
                return res.send(result);
            });
        }
        else {
            return res.status(500).send({message: 'Must send in a item name to check'});
        }
    });
    return router;
};