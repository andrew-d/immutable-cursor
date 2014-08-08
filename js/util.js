'use strict';

/* These are taken from LoDash - the Node.js build:
 *      https://github.com/lodash/lodash-node/blob/master/modern/object/isFunction.js
 *      https://github.com/lodash/lodash-node/blob/master/modern/function/memoize.js
 *
 * Original license: https://github.com/lodash/lodash-node/blob/master/LICENSE.txt
 */

var isFunction = function(value) {
  // avoid a Chakra bug in IE 11
  // https://github.com/jashkenas/underscore/issues/1621
  return typeof value == 'function' || false;
}

var memoize = function(func, resolver) {
  if (!isFunction(func) || (resolver && !isFunction(resolver))) {
    throw new TypeError('Expected a function');
  }
  var memoized = function() {
    var key = resolver ? resolver.apply(this, arguments) : arguments[0];
    if (key == '__proto__') {
      return func.apply(this, arguments);
    }
    var cache = memoized.cache;
    return Object.prototype.hasOwnProperty.call(cache, key)
      ? cache[key]
      : (cache[key] = func.apply(this, arguments));
  }
  memoized.cache = {};
  return memoized;
};

module.exports = {
    isFunction: isFunction,
    memoize: memoize,
};
