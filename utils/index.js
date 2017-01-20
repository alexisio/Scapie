var markdown = require('./markdown'),
    sendType = require('./sendType'),
    request = require('./request');

function Utilities() {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    this.markdown = markdown;
    this.sendType = sendType;
    this.request = request;
    this.dateToString = function (date) {
        var start = new Date(date);
        return monthNames[start.getMonth()] + ' ' + start.getDate() + ' ' + start.getFullYear();
    };
    this.toTitle = function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
}

module.exports = new Utilities();
