const express = require('express'),
    router = express.Router(),
    rsapi = require('rs-api');

module.exports = function (jwtCheck, adminCheck) {
    router.get('/', (req, res) => {
        rsapi.rs.news.getRecent().then(function (news) {
            return res.send(news);
        }).catch(function (err) {
            return res.status(404).send({message: err.message});
        });
    });
    return router;
};