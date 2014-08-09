'use strict';

var expect    = require('chai').expect,
    Immutable = require('immutable');

var ReactRefinementMixin = require('../js/ReactRefinementMixin');


describe('ReactRefinementMixin', function() {
    it('will throw if no property names are given', function() {
        var fn = function() { ReactRefinementMixin(); };

        expect(fn).to.throw(/no property names given/i);
    });

    it('will prevent updating when using the same refinement');

    it('will allow updating for two different refinements');
});
