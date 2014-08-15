'use strict';

var expect    = require('chai').expect,
    Immutable = require('immutable');

var Refinement = require('../js/Refinement'),
    Cursor     = require('../js/Cursor'),
    build      = Cursor.build;


describe('Refinement', function() {
    var c;

    beforeEach(function() {
        c = build({
            a: {
                b: {
                    c: [1,2,3],
                },
            },
            d: {
                e: [4,5,6],
            },
        });
    });

    it('will properly compare changed refinements', function() {
        var r1 = c.refine('a', 'b', 'c', 0),
            r2 = c.refine('d', 'e', 2);

        expect(r1.value).to.equal(1);
        expect(r2.value).to.equal(6);

        // Update the cursor at r1.
        r1.setValue(33);

        var newR1 = c.refine('a', 'b', 'c', 0),
            newR2 = c.refine('d', 'e', 2);

        expect(newR1.equals(r1)).to.be.false;
        expect(newR2.equals(r2)).to.be.true;
    });
});
