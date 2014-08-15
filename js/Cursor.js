/*jslint node: true */

'use strict';

var EventEmitter = require('events').EventEmitter,
    Immutable    = require('immutable'),
    util         = require('util'),
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
    this.object = undefined;
    this._setObject(object);

    /**
     * Whether or not there are un-flushed changes to this cursor.
     *
     * @public
     */
    this.changed = false;
};

util.inherits(Cursor, EventEmitter);

Cursor.prototype._setObject = function(newObject) {
    this.object = newObject;
};

Cursor.prototype._getObject = function() {
    return this.object;
};

Cursor.prototype._updateIn = function(path, cb) {
    // We only want to call the underlying callback once, so we store the
    // returned value here.
    var newValue;
    var wrapperCb = function(oldValue) {
        newValue = cb(oldValue);
        return newValue;
    };

    this._setObject(this._getObject().updateIn(path, wrapperCb));
    this.changed = true;

    return newValue;
};

/**
 * Return a refinement of this cursor for the given path.
 *
 * @param {...(String|Number)} path - The path to refine.
 */
Cursor.prototype.refine = function(path) {
    var args = Array.prototype.slice.call(arguments, 0);
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
    return this._getObject() === other._getObject();
};


/**
 * Create a Cursor instance, converting the given object to an immutable one.
 *
 * @static
 * @param {...*} objects - One or more objects to create the Cursor from.
 * @returns {Cursor}
 */
Cursor.build = function(objects) {
    return new Cursor(Immutable.fromJS.apply(Immutable, arguments));
};


module.exports = Cursor;
