'use strict';
var request = require('request'),
    Settings = require('./../configs/settings.json');

function Request() {
}
var apiRoot = Settings.api.prod;
if (process.env.NODE_ENV === 'development') {
    apiRoot = Settings.api.dev;
}
Request.prototype.api = function (url) {
    return new Promise(function (resolve, reject) {
        request({
            url: apiRoot + url,
            json: true
        }, function (error, response, json) {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                var httpError = new Error('HTTP Code ' + response.statusCode);
                httpError.statusCode = response.statusCode;
                reject(httpError);
                return;
            }

            if (typeof json === 'undefined') {
                var jsonError = new Error('Scapie returned invalid json');
                reject(jsonError);
                return;
            }

            resolve(json);
        });
    });
};

module.exports = new Request();
