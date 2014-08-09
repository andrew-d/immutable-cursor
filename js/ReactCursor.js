/*jslint node: true */

'use strict';

var Cursor    = require('./Cursor'),
    Immutable = require('immutable'),
    util      = require('util');


/**
 * A Cursor subclass that stores the underlying object in a React component's
 * state.
 *
 * @constructor
 * @extends Cursor
 * @param {Object} object - The underlying object.
 * @param {component} component - A React.js component instance.
 * @param {String} [stateKey=cursor] - The key to store in the component's state.
 */
var ReactCursor = function(object, component, stateKey) {
    /**
     * The component this cursor is associated with.
     *
     * @public
     */
    this.component = component;
    this.stateKey = stateKey || 'cursor';

    Cursor.call(this, object);
};

util.inherits(ReactCursor, Cursor);


ReactCursor.prototype._setObject = function(newObject) {
    var newState = {};
    newState[this.stateKey] = newObject;

    this.component.setState(newState);
};


ReactCursor.prototype._getObject = function() {
    return this.component.state[this.stateKey];
};


/**
 * Create a ReactCursor instance, converting the given object to an immutable
 * one.
 *
 * @static
 * @param {Object} object - The underlying object.
 * @param {component} component - A React.js component instance.
 * @param {String} [stateKey=cursor] - The key to store in the component's state.
 * @returns {ReactCursor}
 */
ReactCursor.build = function(object, component, stateKey) {
    return new ReactCursor(Immutable.fromJS(object), component, stateKey);
};


module.exports = ReactCursor;
