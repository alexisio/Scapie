// Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
require('colors');
// Config
const config = require('./api/config');

// app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());

// Set port
const port = process.env.PORT || '5000';
app.set('port', port);

app.use(require('./api')(app, config));

app.listen(port, () => console.log(`Server running on localhost:${port}`.green));

// start discord bot
require('./index');