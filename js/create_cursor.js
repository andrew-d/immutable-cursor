/*jslint node: true */

'use strict';

var Cursor    = require('./Cursor'),
    Immutable = require('immutable');

/**
 * Create a new Cursor from one or more given objects.
 *
 * @param {...*} objects - One or more objects to create the Cursor from.
 * @returns {Cursor}
 */
var create = function(objects) {
    var obj = Immutable.fromJS.apply(Immutable, arguments);
    return new Cursor(obj);
};

module.exports = create;
