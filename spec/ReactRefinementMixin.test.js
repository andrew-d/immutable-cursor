'use strict';

var expect    = require('chai').expect,
    Immutable = require('immutable'),
    React     = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var ReactCursor          = require('../js/ReactCursor'),
    ReactRefinementMixin = require('../js/ReactRefinementMixin');


var initDOM = function() {
    var jsdom = require('jsdom').jsdom;

    global.window = jsdom().createWindow("<html><body></body></html>");
    global.document = global.window.document;
    global.navigator = global.window.navigator;
};


var cleanDOM = function() {
    delete global.window;
    delete global.document;
    delete global.navigator;
};


describe('ReactRefinementMixin', function() {
    beforeEach(function() {
        initDOM();
    });

    afterEach(function() {
        cleanDOM();
    });

    it('will throw if no property names are given', function() {
        var fn = function() { ReactRefinementMixin(); };

        expect(fn).to.throw(/no property names given/i);
    });

    it.skip('will prevent updating when using the same refinement', function() {
        var renderCounts = {};

        var Root = React.createClass({
            componentWillMount: function() {
                this.cursor = ReactCursor.build(this.props.items, this);
            },

            render: function() {
                var itemComponents = [];

                for( var i = 0; i < this.state.cursor.length; i++ ) {
                    var r = this.cursor.refine(i),
                        c = new Item({cursor: r, key: i});
                    itemComponents.push(c);
                }

                return new React.DOM.div(null, itemComponents);
            },
        });

        var Item = React.createClass({
            render: function() {
                renderCounts['i' + this.props.cursor.value]++;
                return new React.DOM.div({
                    'className': 'item',
                }, "Item " + this.props.cursor.value);
            },
        });

        // -----

        var items = [10, 11, 12, 13];
        for( var i = 0; i < items.length; i++ ) {
            renderCounts['i' + items[i]] = 0;
        }

        var rendered = TestUtils.renderIntoDocument(
            new Root({items: items})
        );

        // -----

        var components = TestUtils.scryRenderedComponentsWithType(
                rendered, Item);

        // Assert that we have 4 components, and that we've rendered each of
        // them once.
        expect(components.length).to.equal(4);
        expect(renderCounts['i10']).to.equal(1);
        expect(renderCounts['i11']).to.equal(1);
        expect(renderCounts['i12']).to.equal(1);
        expect(renderCounts['i13']).to.equal(1);

        // Modify a single thing in the tree.
        // TODO: this gives "Invariant Violation: Cannot render markup in a Worker thread."
        //       Should try running in a browser and see if this fixes things...
        components[0].props.cursor.modifyValue(function(v) {
            return v + 1;
        });
    });

    it('will allow updating for two different refinements');
});
