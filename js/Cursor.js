/*jslint node: true */

'use strict';

var EventEmitter = require('events').EventEmitter,
    Immutable    = require('immutable'),
    nodeUtil     = require('util'),
    Refinement   = require('./Refinement');

/**
 * Represents a cursor over an underlying object.
 *
 * @constructor
 * @param {Object} object - The underlying object.
 */
var Cursor = function(object) {
    EventEmitter.call(this);

    /**
     * The underlying object of this cursor
     *
     * @public
     */
    this.object = object;

    /**
     * Whether or not there are un-flushed changes to this cursor.
     *
     * @public
     */
    this.changed = false;
};

nodeUtil.inherits(Cursor, EventEmitter);

Cursor.prototype._updateIn = function(path, cb) {
    // We only want to call the underlying callback once, so we store the
    // returned value here.
    var newValue;
    var wrapperCb = function(oldValue) {
        newValue = cb(oldValue);
        return newValue;
    };

    this.object = this.object.updateIn(path, wrapperCb);
    this.changed = true;

    return newValue;
};

Cursor.prototype._valueAt = function(path) {
    return this.object.getIn(path);
};

/**
 * Return a refinement of this cursor for the given path.
 *
 * @param {...(String|Number)} path - The path to refine.
 */
Cursor.prototype.refine = function(path) {
    var args = Array.prototype.slice.call(arguments);
    return Refinement.call(null, this, args);
};

/**
 * If this cursor has changed, then emit the 'change' event and set the changed
 * flag back to false.
 */
Cursor.prototype.flush = function() {
    if( this.changed ) {
        this.emit('change');
        this.changed = false;
    }
};

/**
 * Compares this cursor to another and returns whether the two are equal.
 *
 * @param {Cursor} other - The other cursor.
 * @returns {Boolean}
 */
Cursor.prototype.equals = function(other) {
    return this.object === other.object;
};

module.exports = Cursor;
