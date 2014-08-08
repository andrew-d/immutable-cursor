'use strict';

var expect    = require('chai').expect,
    React     = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var ReactCursor = require('../js/ReactCursor');


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


describe('ReactCursor', function() {
    beforeEach(function() {
        initDOM();
    });

    afterEach(function() {
        cleanDOM();
    });

    var TestComponent = React.createClass({
        getInitialState: function() {
            return {
                foo: 'bar',
                baz: 123,
            };
        },

        componentWillMount: function() {
            var obj = {
                a: {
                    nested: 'value 123',
                },
            };
            this.cursor = ReactCursor.build(obj, this, 'cursor');
        },

        render: function() {
            var ref = this.cursor.refine('a', 'nested');
            var txt = ("foo: " + this.state.foo + '\n' +
                       "baz: " + this.state.baz + '\n' +
                       "ref: " + ref.value);
            return React.DOM.text({}, txt);
        },
    });

    it('will store state in the React component', function() {
        var rendered = TestUtils.renderIntoDocument(
            new TestComponent(null)
        );

        var component = TestUtils.findRenderedComponentWithType(
            rendered, TestComponent);

        expect(component.state.foo).to.equal('bar');
        expect(component.state.baz).to.equal(123);
        expect(component.state.cursor).to.not.be.undefined;
    });


    it('will properly render values', function() {
        var str = React.renderComponentToString(new TestComponent(null));
        expect(str).to.match(/ref\: value 123/);
    });
});
