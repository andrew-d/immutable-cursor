'use strict';

var EventEmitter = require('events').EventEmitter,
    Immutable    = require('immutable'),
    nodeUtil     = require('util'),
    Refinement   = require('./Refinement');


var Cursor = function(object) {
    EventEmitter.call(this);
    this.object = object;
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

// Return a sub-cursor from this cursor.
Cursor.prototype.refine = function() {
    var args = Array.prototype.slice.call(arguments);
    return Refinement.call(null, this, args);
};

// If the cursor has changed, then trigger a change callback.
Cursor.prototype.flush = function() {
    if( this.changed !== undefined && this.changed ) {
        this.emit('change');
        this.changed = false;
    }
};

Cursor.prototype.equals = function(other) {
    return this.object === other.object;
};

module.exports = Cursor;
