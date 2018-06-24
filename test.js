const fs = require('fs');
const hd = require('./html-defects.js');
const assert = require('assert');
const equalRule = require('./ruleEqualNumberOfClosingOpeningTags.js');
const TagsWithoutAttributesRule = require('./ruleTagsWithoutAttributes.js');
const HeaderWithoutTagsRule = require('./ruleHeaderWithoutTags.js');
const TagQuantityComparisonRule = require('./ruleTagQuantityComparison.js');
const challengeRules = require('./rules.js');

const rules = {
  tagsWithoutAttributes: [
    {
      img: 'alt',
    },
    {
      a: 'rel',
    },
  ],
};
const inputOptions = {
  inputMethod: 'string',
  source: '<html><img src="foo.jpg" /><img src="bar.jpg" alt="bar" /></html>',
};
const writableStream = fs.createWriteStream('writeStream.txt');
const outputOptions = {
  outputMethod: 'stream',
  destination: writableStream,
};
// hd.checkDefects(rules, inputOptions, outputOptions);

const inputOptions2 = {
  inputMethod: 'file',
  source: 'test.html',
};
const outputOptions2 = {
  outputMethod: 'console',
};
// hd.checkDefects(rules, inputOptions2, outputOptions2);

const readableStream = fs.createReadStream('test.html');
const inputOptions3 = {
  inputMethod: 'stream',
  source: readableStream,
};
const outputOptions3 = {
  outputMethod: 'file',
  destination: 'writeFile.txt',
};
// hd.checkDefects(rules, inputOptions3, outputOptions3);

/* 
let challengeRules = {
  ruleMap: {
    tagsWithoutAttributes: new TagsWithoutAttributesRule(),
    headerWithoutTags: new HeaderWithoutTagsRule(),
    tagQuantityComparison: new TagQuantityComparisonRule(),
  }, // can't use for rule of Object.keys(rules) if there's ruleMap here.
  headerWithoutTags: [
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
  ],
  tagsWithoutAttributes: [
    {
      img: 'alt',
    },
    {
      a: 'rel',
    },
  ],
  tagQuantityComparison: [
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
};
*/

// the key is irrelevant, maybe just pass an array instead
// of an object
let asdf = {
  headerWithoutTags: {
    rule: new HeaderWithoutTagsRule(),
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
    ],
  }
}






const challengeInputOptions = {
  inputMethod: 'string',
  source: '<html><head><meta name="descriptions"><meta charset="utf-8"></head><span data-node class="c1 c2"><img src="hello.jpg" /><img src="hello.jpg" alt="hello"/></span><span>Hello i\'m a "test"</span><div></html>',
};
const challengeOutputOptions = {
  outputMethod: 'console',
};

hd.checkDefects(challengeRules, challengeInputOptions, challengeOutputOptions);
