const React = require('react');
module.exports = {
    TagsInput: React.forwardRef((props, ref) => React.createElement('div', { ref, ...props })),
    TagsInputClear: React.forwardRef((props, ref) => React.createElement('div', { ref, ...props })),
    TagsInputInput: React.forwardRef((props, ref) => React.createElement('div', { ref, ...props })),
    TagsInputItem: React.forwardRef((props, ref) => React.createElement('div', { ref, ...props })),
    TagsInputList: React.forwardRef((props, ref) => React.createElement('div', { ref, ...props })),
};