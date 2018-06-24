const hd = require('@jgch/html-defects');

const EqualNumberOfOpeningClosingTagsRule = require('./ruleEqualNumberOfOpeningClosingTags.js');

const rules = [
  {
    definition: new EqualNumberOfOpeningClosingTagsRule(),
    options: [
      {
        name: 'html',
      },
      {
        name: 'div',
      },
    ],
  },
];

const inputOptions = {
  inputMethod: 'string',
  source: '<html><head><meta name="descriptions"><meta charset="utf-8"></head><span data-node class="c1 c2"><img src="hello.jpg" /><img src="hello.jpg" alt="hello"/></span><span>Hello i\'m a "test"</span><div></html>',
};

const outputOptions = {
  outputMethod: 'console',
};

hd.checkDefects(rules, inputOptions, outputOptions);
