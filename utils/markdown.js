'use strict';

function Markdown() {
}

Markdown.prototype.bold = function (string) {
    return '**' + string + '**';
};

Markdown.prototype.boldUnderline = function (string) {
    return '**__' + string + '__**';
};

Markdown.prototype.italicize = function (string) {
    return '*' + string + '*';
};

Markdown.prototype.underline = function (string) {
    return '__' + string + '__';
};

Markdown.prototype.code = function (string) {
    return '`' + string  + '`';
};

Markdown.prototype.codeBlock = function (string, type) {
  return '```' + type + '\n' + string + '\n' + '```';
};

module.exports = new Markdown();
