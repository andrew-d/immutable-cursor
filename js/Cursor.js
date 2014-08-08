'use strict';

var EventEmitter = require('events').EventEmitter,
    Immutable    = require('immutable'),
    nodeUtil     = require('util'),
    util         = require('./util');

/* Unresolved questions:
 *  - How do we handle the various types of Immutable datatypes?
 *      - Do we want a different cursor type for each datatype?
 *  - How much caching should we have for the create() function?
 *  - There should be some way of 'batching' changes, so that we only
 *    update the underlying datastructure once
 *      - Perhaps, have a flush() method that we can call to do this?
 */

var Cursor = function(root, path, rootCursor) {
    EventEmitter.call(this);

    if( path === undefined ) {
        // Root cursor
        this.path = [];
        this.rootCursor = this;
        this.changed = false;
        this.value = root;
    } else {
        // Non-root cursor
        this.path = path;
        this.rootCursor = rootCursor;
        this.value = root.getIn(path);

        if( this.value === undefined ) {
            throw new Error("Invalid path through object: " + path);
        }
    }

    this.root = root;
};

nodeUtil.inherits(Cursor, EventEmitter);

// Return a sub-cursor from this cursor.
Cursor.prototype.refine = function() {
    var refinement = Array.prototype.slice.call(arguments),
        newPath    = this.path.concat(refinement);
    return internalCreate(this.root, newPath, this.rootCursor);
};

// Change the value of this cursor.
Cursor.prototype.setValue = function(newValue) {
    this.value = this.rootCursor._updateIn(this.path, function() { return newValue; });
};

// Modify the value of this cursor.
Cursor.prototype.modifyValue = function(cb) {
    this.value = this.rootCursor._updateIn(this.path, cb);
};

// Update the value at a path.  Should only be called on the root
// instance.
Cursor.prototype._updateIn = function(path, cb) {
    if( this.path.length !== 0 ) {
        throw new Error("Tried to _updateIn() on a non-root Cursor");
    }

    // We only want to call the underlying callback once, so we store the
    // returned value here.
    var newValue;
    var wrapperCb = function(oldValue) {
        newValue = cb(oldValue);
        return newValue;
    };

    this.root = this.value = this.root.updateIn(path, wrapperCb);
    this.changed = true;

    return newValue;
};

// If the cursor has changed, then trigger a change callback.
Cursor.prototype.flush = function() {
    if( this.changed !== undefined && this.changed ) {
        this.emit('change');
        this.changed = false;
    }
};

// Internal function for creating cursors.
var internalCreate = function(root, path, rootCursor) {
    return new Cursor(root, path, rootCursor);
};
internalCreate = util.memoize(internalCreate, function(root, path, rootCursor) {
    // TODO: is this an appropriate hash key?
    return JSON.stringify(root) + JSON.stringify(path);
});

// Create and return a cursor for a given object.
var create = function(/*arguments*/) {
    var imm = Immutable.fromJS.apply(Immutable, arguments);
    return internalCreate(imm);
};

module.exports = create;
