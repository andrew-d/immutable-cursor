/*jslint node: true */

'use strict';

var Immutable = require('immutable');


/**
 * This callback is used when modifying the underlying value of a refinement
 *
 * @callback modifyCb
 * @param {*} oldValue - The previous value at this refinement.
 * @returns {*}
 */


var arraysEqual = function(a, b) {
    if( a === b ) return true;
    if( a === null || b === null ) return false;
    if( a.length != b.length ) return false;

    for( var i = 0; i < a.length; ++i ) {
        if( a[i] !== b[i] ) return false;
    }

    return true;
};


/**
 * Represents a refinement of a given cursor.
 *
 * @constructor
 * @param {Cursor} cursor - The underlying cursor.
 * @param {...(String|Number)} path - The path of this refinement.
 */
var Refinement = function(cursor, parent, path) {
    // This pattern allows us to call `new Refinement(...)` or the regular
    // `Refinement(...)` - this is useful since we can't use .apply() with
    // the `new` operator.
    if( this instanceof Refinement ) {
        this.cursor = cursor;
        this.parent = parent;
        this.path   = path;

        /**
         * The underlying value for this refinement.
         *
         * @public
         */
        this.value = cursor._valueAt(path);

        if( this.value === undefined ) {
            throw new Error("Invalid path through object: " + path);
        }
    } else {
        return new Refinement(cursor, parent, path);
    }
};


/**
 * Return another Refinement instance, with a path starting from this
 * refinement.
 *
 * @param {...(String|Number)} path - The path to refine.
 * @returns {Refinement}
 */
Refinement.prototype.refine = function(path) {
    var args    = Array.prototype.slice.call(arguments),
        newPath = this.path.concat(args);
    return new Refinement(this.cursor, this, newPath);
};

/**
 * Set the underlying value of this refinement.
 *
 * @param {*} newValue - The new value to set.
 */
Refinement.prototype.setValue = function(newValue) {
    this.value = this.cursor._updateIn(this.path, function() { return newValue; });
};

/**
 * Modify the underlying value of this refinement via a callback.
 *
 * @param {modifyCb} cb - The callback used to modify.  Will only be called
 *                        once per invocation of modifyValue.
 */
Refinement.prototype.modifyValue = function(cb) {
    this.value = this.cursor._updateIn(this.path, cb);
};


/**
 * Compares this refinement to another and returns whether the two are equal.
 *
 * @param {Refinement} other - The other refinement.
 * @returns {Boolean}
 */
Refinement.prototype.equals = function(other) {
    // Two refinements are equal if they have the same path through the same
    // root object for the same overall cursor.  We can't compare just the
    // paths, and the root object will change with every modification.
    // However, since intermediate objects are immutable, we can compare those.

    // Check if these are for the same cursor first.
    if( this.cursor !== other.cursor ) {
        return false;
    }

    // Compare the two paths.
    if( !arraysEqual(this.path, other.path) ) {
        return false;
    }

    // Even if the paths are the same, a modification may have happened, and
    // the two cursors refer to an older version of the same path.  We now walk
    // the object tree looking to see if each of the intervening objects in the
    // path are the same.  Note that even if the root objects differ, it
    // doesn't mean that the refinements are different, since it's possible
    // that a different subtree of the root was modified.

    // TODO: implement me!
    return false;
};

module.exports = Refinement;
