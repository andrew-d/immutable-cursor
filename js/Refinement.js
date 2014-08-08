'use strict';

var Immutable = require('immutable');


var arraysEqual = function(a, b) {
    if( a === b ) return true;
    if( a == null || b == null ) return false;
    if( a.length != b.length ) return false;

    for( var i = 0; i < a.length; ++i ) {
        if( a[i] !== b[i] ) return false;
    }

    return true;
};


var Refinement = function(cursor, path) {
    // This pattern allows us to call `new Refinement(...)` or the regular
    // `Refinement(...)` - this is useful since we can't use .apply() with
    // the `new` operator.
    if( this instanceof Refinement ) {
        this.cursor = cursor;
        this.path   = path;
        this.value  = cursor._valueAt(path);

        if( this.value === undefined ) {
            throw new Error("Invalid path through object: " + path);
        }
    } else {
        return new Refinement(cursor, path);
    }
};


Refinement.prototype.refine = function(/*arguments*/) {
    var args    = Array.prototype.slice.call(arguments),
        newPath = this.path.concat(args);
    return new Refinement(this.cursor, newPath);
};

Refinement.prototype.setValue = function(newValue) {
    this.value = this.cursor._updateIn(this.path, function() { return newValue; });
};

Refinement.prototype.modifyValue = function(cb) {
    this.value = this.cursor._updateIn(this.path, cb);
};

Refinement.prototype.equals = function(other) {
    return (this.cursor.equals(other.cursor) &&
            arraysEqual(this.path, other.path));
};

module.exports = Refinement;
