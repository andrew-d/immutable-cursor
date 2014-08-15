'use strict';

var expect    = require('chai').expect,
    Immutable = require('immutable'),
    React     = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var ReactCursor          = require('../js/ReactCursor'),
    ReactRefinementMixin = require('../js/ReactRefinementMixin');


describe('ReactRefinementMixin', function() {
    it('will throw if no property names are given', function() {
        var fn = function() { ReactRefinementMixin(); };

        expect(fn).to.throw(/no property names given/i);
    });

    it('will prevent updating when using the same refinement', function() {
        var renderCounts = {};

        var Root = React.createClass({
            componentWillMount: function() {
                this.cursor = ReactCursor.build(this.props.items, this);
            },

            render: function() {
                var itemComponents = [];

                for( var i = 0; i < this.state.cursor.length; i++ ) {
                    var r = this.cursor.refine(i, 'id'),
                        c = new Item({cursor: r, key: i});

                    itemComponents.push(c);
                }

                return new React.DOM.div(null, itemComponents);
            },
        });

        var Item = React.createClass({
            mixins: [ReactRefinementMixin("cursor")],

            render: function() {
                var id = this.props.cursor.value;

                if( renderCounts['i' + id] === undefined ) renderCounts['i' + id] = 0;
                renderCounts['i' + id]++;

                return new React.DOM.div({
                    'className': 'item',
                }, "Item " + id);
            },
        });

        // -----

        // Note: we can only check for equality at the object level.  In this
        //       case, if we were to modify an item in the top-level array,
        //       then the entire array would appear to have "changed", and thus
        //       we would need to re-render it.  So, instead, we create sub-
        //       objects, which can each be modified without influencing the
        //       others.
        // TODO: mention this in the docs
        var items = [
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
        ];

        var rendered = TestUtils.renderIntoDocument(
            new Root({items: items})
        );

        // -----

        var components = TestUtils.scryRenderedComponentsWithType(
                rendered, Item);

        // Assert that we have 4 components, and that we've rendered each of
        // them once.
        expect(components.length).to.equal(4);
        expect(renderCounts['i1']).to.equal(1);
        expect(renderCounts['i2']).to.equal(1);
        expect(renderCounts['i3']).to.equal(1);
        expect(renderCounts['i4']).to.equal(1);

        // Modify a single thing in the tree.
        var cur = components[0].props.cursor;
        cur.modifyValue(function(v) {
            return v + 10;
        });

        /* This would be the expected output without the mixin
        expect(renderCounts['i10']).to.equal(1);
        expect(renderCounts['i11']).to.equal(2);
        expect(renderCounts['i12']).to.equal(2);
        expect(renderCounts['i13']).to.equal(2);
        expect(renderCounts['i20']).to.equal(1);
        */

        expect(renderCounts['i1']).to.equal(1);
        expect(renderCounts['i2']).to.equal(1);
        expect(renderCounts['i3']).to.equal(1);
        expect(renderCounts['i4']).to.equal(1);
        expect(renderCounts['i11']).to.equal(1);
    });

    it('will allow updating for two different refinements');

});
