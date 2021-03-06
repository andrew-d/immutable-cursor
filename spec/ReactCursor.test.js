'use strict';

var expect    = require('chai').expect,
    React     = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var ReactCursor = require('../js/ReactCursor');


describe('ReactCursor', function() {
    var testObj;

    beforeEach(function() {
        testObj = {
            a: {
                nested: 'value 123',
            },
        };
    });

    var TestComponent = React.createClass({
        getInitialState: function() {
            return {
                foo: 'bar',
                baz: 123,
            };
        },

        componentWillMount: function() {
            this.cursor = ReactCursor.build(this.props.obj, this, 'cursor');
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
            new TestComponent({obj: testObj})
        );

        var component = TestUtils.findRenderedComponentWithType(
            rendered, TestComponent);

        expect(component.state.foo).to.equal('bar');
        expect(component.state.baz).to.equal(123);
        expect(component.state.cursor).to.not.be.undefined;
    });


    it('will properly render values', function() {
        var str = React.renderComponentToString(
            new TestComponent({obj: testObj})
        );
        expect(str).to.match(/ref\: value 123/);
    });
});
