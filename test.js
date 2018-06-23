const hd = require('./html-defects.js');
const fs = require('fs');

const rules = {
  tagsWithoutAttributes: [
    {
      'img': 'alt',
    },
    {
      'a': 'rel',
    },
  ],
};
const inputOptions = {
  'inputMethod': 'string',
  'source': '<html><img src="foo.jpg" /><img src="bar.jpg" alt="bar" /></html>',
};
const writableStream = fs.createWriteStream('writeStream.txt');
const outputOptions = {
  'outputMethod': 'stream',
  'destination': writableStream,
};
hd.checkDefects(rules, inputOptions, outputOptions);

const inputOptions2 = {
  'inputMethod': 'file',
  'source': 'test.html',
};
const outputOptions2 = {
  'outputMethod': 'console',
};
hd.checkDefects(rules, inputOptions2, outputOptions2);

const readableStream = fs.createReadStream('test.html');
const inputOptions3 = {
  'inputMethod': 'stream',
  'source': readableStream,
};
const outputOptions3 = {
  'outputMethod': 'file',
  'destination': 'writeFile.txt',
};
hd.checkDefects(rules, inputOptions3, outputOptions3);


const challengeRules = {
  headerWithoutTags: [
    { 
      "title": {},
    },
    { 
      "meta": {
        "name": '"descriptions"',
      },
    },
    {
      "meta": {
        "name": '"keywords"',
      },
    },
    {
      "meta": {
        "name": '"robots"',
      },
    },
  ],
  tagsWithoutAttributes: [
    {
      "img": "alt",
    },
    {
      "a": "rel",
    },
  ],
  tagQuantityComparison: [
    {
      "comparisonOperator": ">",
      "elementName": "strong",
      "quantity": 15,
    },
    {
      "comparisonOperator": ">",
      "elementName": "h1",
      "quantity": 1,
    },
  ],
};
const challengeInputOptions = {
  'inputMethod': 'string',
  'source': '<html><head><meta name="descriptions"><meta charset="utf-8"></head><span data-node class="c1 c2"><img src="hello.jpg" /><img src="hello.jpg" alt="hello"/></span><span>Hello i\'m a "test"</span></html>',
};
const challengeOutputOptions = {
  'outputMethod': 'console',
};

hd.checkDefects(challengeRules, challengeInputOptions, challengeOutputOptions);
