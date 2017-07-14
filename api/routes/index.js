const express = require('express'),
    router = express.Router();

module.exports = function(jwtCheck, adminCheck) {
    router.use('/players', require('./players')(jwtCheck, adminCheck));
    router.use('/clans', require('./clans')(jwtCheck, adminCheck));
    router.use('/ge', require('./ge')(jwtCheck, adminCheck));
    router.use('/pvm', require('./pvm')(jwtCheck, adminCheck));
    router.use('/minigames', require('./minigames')(jwtCheck, adminCheck));
    router.use('/skilling', require('./skilling')(jwtCheck, adminCheck));
    router.use('/news', require('./news')(jwtCheck, adminCheck));
    return router;
}