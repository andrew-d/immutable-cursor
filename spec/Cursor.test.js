'use strict';

var expect    = require('chai').expect,
    Immutable = require('immutable');

var Cursor = require('../js/Cursor'),
    build  = Cursor.build;


describe('Cursor', function() {
    describe('.build', function() {
        var c;

        beforeEach(function() {
            c = build([1,2,3]);
        });

        it('will create a cursor from maps and vectors', function() {
            build([1,2,3]);
            build({'a': 1, 'b': 2});
        });

        it('will convert to an Immutable object upon creation', function() {
            expect(c.object).to.be.instanceof(Immutable.Vector);
        });

        it('will return instances of Cursor', function() {
            expect(c).to.be.instanceof(Cursor);
        });
    });

    it('allow refining a nested cursor', function() {
        var c = build({'a': {'b': 123}});

        var r1 = c.refine('a'),
            r2 = r1.refine('b');

        expect(r1.value).to.not.be.undefined;
        expect(r2.value).to.equal(123);
    });

    it('will allow refining a nested vector', function() {
        var c = build({'a': ['b', 'c', {'d': 123}]});

        var r1 = c.refine('a'),
            r2 = r1.refine(2),
            r3 = r2.refine('d');

        expect(r1.value).to.not.be.undefined;
        expect(r2.value).to.not.be.undefined;
        expect(r3.value).to.equal(123);
    });

    it('will allow refining multiple items in a single call', function() {
        var c = build({'a': ['b', 'c', {'d': 123}]});

        var r = c.refine('a', 2, 'd');

        expect(r.value).to.equal(123);
    });

    it('will throw if an invalid path is given', function() {
        var c = build({'a': {'b': {'c': 123}}});

        var fn = function() { c.refine('a', 'b', 'qqq'); };

        expect(fn).to.throw(/invalid path/i);
    });

    it('will allow changing a nested value', function() {
        var c = build({'a': {'b': 123}}),
            r1 = c.refine('a', 'b');

        r1.setValue(456);

        expect(c.object.toJS()).to.deep.equal({'a': {'b': 456}});
        expect(r1.value).to.equal(456);
    });

    it('will allow modifying a value', function() {
        var c = build([1,2,3]),
            r = c.refine(0);

        expect(r.value).to.equal(1);
        expect(c.object.toJS()).to.deep.equal([1,2,3]);

        r.modifyValue(function(val) {
            return val + 10;
        });

        expect(r.value).to.equal(11);
        expect(c.object.toJS()).to.deep.equal([11,2,3]);
    });

    it('will track changes', function() {
        var c = build([1,2,3]),
            r = c.refine(0);

        expect(c.changed).to.equal(false);
        r.setValue(10);
        expect(c.changed).to.equal(true);
        c.flush();
        expect(c.changed).to.equal(false);
    });

    it('will flush changes after modification', function() {
        var c = build([1,2,3]),
            r = c.refine(0),
            changed = false;

        c.on('change', function() {
            changed = true;
        });

        r.setValue(10);
        c.flush();

        expect(changed).to.equal(true);
    });
});
