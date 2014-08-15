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
var Refinement = function(cursor, path) {
    // This pattern allows us to call `new Refinement(...)` or the regular
    // `Refinement(...)` - this is useful since we can't use .apply() with
    // the `new` operator.
    if( this instanceof Refinement ) {
        if( path.length === 0 ) {
            throw new Error("Path is too short: " + path);
        }

        this.cursor = cursor;
        this.path   = path;

        // We store the 'object' that this refinement refers to - i.e. the
        // collection in which the final segment of the path can be found.
        var objPath  = path.slice(0, -1),
            finalKey = path[path.length-1],
            object   = cursor._getObject();

        if( objPath.length > 0 ) {
            object = object.getIn(objPath);
            console.log("" + this.path + ": object = " + object);
        }
        this.object = object;

        /**
         * The underlying value for this refinement.
         *
         * @public
         */
        this.value = this.object.get(finalKey);

        if( this.value === undefined ) {
            throw new Error("Invalid path through object: " + path);
        }
    } else {
        return new Refinement(cursor, path);
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
    return new Refinement(this.cursor, newPath);
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
    // Two refinements are equal if they have the same path from the same root
    // cursor, and refer to the same collection.  E.g. if two refinements both
    // have the same path ['a', 'b', 'c'] from the same root cursor, and the
    // object at this path is the same, then they are equal.

    // Check if these are for the same cursor first.
    if( this.cursor !== other.cursor ) {
        console.log("" + this.path + ": cursors are not equal");
        return false;
    }

    // Compare the two objects.
    if( this.object !== other.object ) {
        console.log("" + this.path + ": objects are not equal");
        return false;
    }

    // Compare the two paths.
    if( !arraysEqual(this.path, other.path) ) {
        console.log("" + this.path + ": paths are not equal");
        return false;
    }

    console.log("" + this.path + ": EQUAL");
    return true;
};

module.exports = Refinement;
