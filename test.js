const fs = require('fs');
const hd = require('@jgch/html-defects.js');

const TagsWithoutAttributesRule = require('./ruleTagsWithoutAttributes.js');
const HeaderWithoutTagsRule = require('./ruleHeaderWithoutTags.js');
const TagQuantityComparisonRule = require('./ruleTagQuantityComparison.js');


const rules = [
  {
    definition: new TagsWithoutAttributesRule(),
    options: [
      {
        img: 'alt',
        a: 'rel',
      },
    ],
  },
  {
    definition: new HeaderWithoutTagsRule(),
    options: [
      {
        title: {},
      },
      {
        meta: {
          name: '"descriptions"',
        },
      },
      {
        meta: {
          name: '"keywords"',
        },
      },
      {
        meta: {
          name: '"robots"',
        },
      },
    ]
  },
  {
    definition: new TagQuantityComparisonRule(),
    options: [
      {
        comparisonOperator: '>',
        elementName: 'strong',
        quantity: 15,
      },
      {
        comparisonOperator: '>',
        elementName: 'h1',
        quantity: 1,
      },
    ],
  },
];

const inputOptions = {
  inputMethod: 'file',
  source: 'test.html',
};

const outputOptions = {
  outputMethod: 'file',
  destination: 'results.txt',
};

hd.checkDefects(rules, inputOptions, outputOptions);

