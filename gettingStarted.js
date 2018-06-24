// The defect checker module
const hd = require('@jgch/html-defects');

// The rule classes
const TagsWithoutAttributesRule = require('./ruleTagsWithoutAttributes.js');

// Instantiating the rules with options
const rules = [
  {
    definition: new TagsWithoutAttributesRule(),
    options: [
      {
        img: 'alt',
      },
      {
        a: 'rel',
      },
    ],
  },
];

// Specifying input method and source
const inputOptions = {
  inputMethod: 'string',
  source: '<html><img src="foo.jpg" /></html>',
};

// Specifying output method and destination
const outputOptions = {
  outputMethod: 'console',
};

hd.checkDefects(rules, inputOptions, outputOptions);
