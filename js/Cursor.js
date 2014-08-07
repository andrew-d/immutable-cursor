var Immutable = require('immutable');

/* Unresolved questions:
 *  - How do we handle the various types of Immutable datatypes?
 *      - Do we want a different cursor type for each datatype?
 *  - How much caching should we have for the create() function?
 *  - There should be some way of 'batching' changes, so that we only
 *    update the underlying datastructure once
 *      - Perhaps, have a flush() method that we can call to do this?
 */

var Cursor = function(root, path) {
    this.path = path === undefined ? [] : path;
    this.root = root;

    // Get the value at this path.
    // TODO
    this.value = null;
};

// Return a sub-cursor from this cursor.
Cursor.prototype.refine = function() {
    return create(this.root, [].concat(this.path, arguments));
};

// Change the value of this cursor.
Cursor.prototype.setValue = function(newValue) {
    // TODO;
    return;
};

// Create and return a cursor for a given object.
// TODO: memoize this function
var create = function(root) {
    return;
};

module.exports = build;
