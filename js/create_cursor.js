var Cursor    = require('./Cursor'),
    Immutable = require('immutable');

var create = function(/*arguments*/) {
    var obj = Immutable.fromJS.apply(Immutable, arguments);
    return new Cursor(obj);
};

module.exports = create;
