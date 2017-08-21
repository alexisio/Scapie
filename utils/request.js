var request = require('request');

function Request() {
}
var apiRoot = `http://localhost:${process.env.PORT || '5000'}`;

Request.prototype.api = function (url, method, form) {
    return new Promise(function (resolve, reject) {
        if (typeof method == 'undefined') {
            method = 'GET';
        }
        var options = {
            method: method.toUpperCase(),
            url: apiRoot + url,
            json: true
        };
        if (typeof form !== 'undefined') {
            options.form = form;
        }
        request(options, function (error, response, json) {
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

Request.prototype.remoteApi = function (url, method, form) {
    return new Promise(function (resolve, reject) {
        if (typeof method == 'undefined') {
            method = 'GET';
        }
        var options = {
            method: method.toUpperCase(),
            url: url,
            json: true
        };
        if (typeof form !== 'undefined') {
            options.form = form;
        }
        request(options, function (error, response, json) {
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
            if (typeof json != 'object') {
                var jsonError = new Error('Scapie returned invalid json');
                reject(jsonError);
                return;
            }

            resolve(json);
        });
    });
};

module.exports = new Request();
