/*jslint node: true */

'use strict';


/**
 * Returns a mixin that you can include in a React component to improve
 * performance when using refinements.  The mixin will add a
 * 'shouldComponentUpdate' function that compares the new refinement
 * against the previous one, not updating if they are the same.
 *
 * @param {...String} refProps - The name(s) of the property or properties that
 *                               contain refinements.
 * @returns {Object}
 */
var ReactRefinementMixin = function(refProps) {
    var args = Array.prototype.slice.call(arguments);

    if( args.length === 0 ) {
        throw new Error("No property names given");
    }

    return {
        shouldComponentUpdate: function(nextProps, nextState) {
            // For each of the given properties, we loop through and compare them.
            for( var i = 0; i < args.length; i++ ) {
                var propName = args[i],
                    oldProp = this.props[propName],
                    newProp = nextProps[propName];

                if( oldProp === undefined || newProp === undefined ) {
                    throw new Error('Unable to find property "' +
                                    propName +
                                    '" in component');
                }

                // If the props differ, then we need to re-render.
                if( !oldProp.equals(newProp) ) {
                    return true;
                }
            }

            // If we get here, all properties are equal and we can do nothing.
            return false;
        },
    };
};


module.exports = ReactRefinementMixin;
