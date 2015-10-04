(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SplitPane = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactVendorPrefix = require('react-vendor-prefix');

var _reactVendorPrefix2 = _interopRequireDefault(_reactVendorPrefix);

exports['default'] = _react2['default'].createClass({
    displayName: 'Pane',

    getInitialState: function getInitialState() {
        return {};
    },

    render: function render() {
        var split = this.props.split;
        var classes = ['Pane', split];

        var style = {
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'auto'
        };
        if (this.state.size) {
            if (split === 'horizontal') {
                style.height = this.state.size;
                style.display = 'flex';
            } else {
                style.width = this.state.size;
            }
            style.flex = 'none';
        }
        var prefixed = _reactVendorPrefix2['default'].prefix({ styles: style });

        return _react2['default'].createElement(
            'div',
            { className: classes.join(' '), style: prefixed.styles },
            this.props.children
        );
    }
});
module.exports = exports['default'];

},{"react":undefined,"react-vendor-prefix":undefined}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

exports['default'] = _react2['default'].createClass({
    displayName: 'Resizer',

    onMouseDown: function onMouseDown(event) {
        this.props.onMouseDown(event);
    },

    render: function render() {
        var split = this.props.split;
        var classes = ['Resizer', split];
        return _react2['default'].createElement('span', { className: classes.join(' '), onMouseDown: this.onMouseDown });
    }
});
module.exports = exports['default'];

},{"react":undefined}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Pane = require('./Pane');

var _Pane2 = _interopRequireDefault(_Pane);

var _Resizer = require('./Resizer');

var _Resizer2 = _interopRequireDefault(_Resizer);

var _reactVendorPrefix = require('react-vendor-prefix');

var _reactVendorPrefix2 = _interopRequireDefault(_reactVendorPrefix);

exports['default'] = _react2['default'].createClass({
    displayName: 'SplitPane',

    propTypes: {
        //minSize: React.PropTypes.number,
        //defaultSize: React.PropTypes.number,
        //split: React.PropTypes.string
        //onChange: React.PropTypes.func
    },

    getInitialState: function getInitialState() {
        return {
            active: false,
            resized: false
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            minSize: 0
        };
    },

    componentDidMount: function componentDidMount() {
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        var ref = this.refs.pane1;
        if (ref && this.props.defaultSize && !this.state.resized) {
            ref.setState({
                size: this.props.defaultSize
            });
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
    },

    onMouseDown: function onMouseDown(event) {
        var position = this.props.split === 'vertical' ? event.clientX : event.clientY;
        this.setState({
            active: true,
            position: position
        });
    },

    onMouseMove: function onMouseMove(event) {
        if (this.state.active) {
            var ref = this.refs.pane1;
            if (ref) {
                var node = ref.getDOMNode();
                if (window.getComputedStyle) {
                    var styles = window.getComputedStyle(node);
                    var width = styles.width.replace('px', '');
                    var height = styles.height.replace('px', '');
                    var current = this.props.split === 'vertical' ? event.clientX : event.clientY;
                    var size = this.props.split === 'vertical' ? width : height;
                    var position = this.state.position;

                    var newSize = size - (position - current);
                    this.setState({
                        position: current,
                        resized: true
                    });

                    if (newSize >= this.props.minSize) {
                        if (this.props.onChange) {
                            this.props.onChange(newSize);
                        }
                        ref.setState({
                            size: newSize
                        });
                    }
                }
            }
        }
    },

    onMouseUp: function onMouseUp() {
        this.setState({
            active: false
        });
    },

    merge: function merge(into, obj) {
        for (var attr in obj) {
            into[attr] = obj[attr];
        }
    },

    render: function render() {

        var split = this.props.split || 'vertical';

        var style = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden',
            userSelect: 'none'
        };

        if (split === 'horizontal') {
            this.merge(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%'
            });
        } else {
            this.merge(style, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0
            });
        }

        var children = this.props.children;
        var classes = ['SplitPane', split];
        var prefixed = _reactVendorPrefix2['default'].prefix({ styles: style });

        return _react2['default'].createElement(
            'div',
            { className: classes.join(' '), style: prefixed.styles, ref: 'splitPane' },
            _react2['default'].createElement(
                _Pane2['default'],
                { ref: 'pane1', key: 'pane1', split: split },
                children[0]
            ),
            _react2['default'].createElement(_Resizer2['default'], { ref: 'resizer', key: 'resizer', onMouseDown: this.onMouseDown, split: split }),
            _react2['default'].createElement(
                _Pane2['default'],
                { ref: 'pane2', key: 'pane2', split: split },
                children[1]
            )
        );
    }
});
module.exports = exports['default'];

},{"./Pane":1,"./Resizer":2,"react":undefined,"react-vendor-prefix":undefined}]},{},[3])(3)
});