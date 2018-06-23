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


const rules4 = {
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
        "charset": '"utf-8"',
      },
    },
    {
      "span": {
        "class": '"c1 c2"',
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
    {
      "span": "data-node",
    },
  ],
  tagQuantityComparison: [
    {
      "comparisonOperator": "<=",
      "elementName": "strong",
      "quantity": 15,
    },
    {
      "comparisonOperator": ">",
      "elementName": "img",
      "quantity": 1,
    },
    {
      "comparisonOperator": ">",
      "elementName": "span",
      "quantity": 1,
    },
  ],
};
const inputOptions4 = {
  'inputMethod': 'string',
  'source': '<html><head><meta name="descriptions"><meta charset="utf-8"></head><span data-node class="c1 c2"><img src="hello.jpg" /><img src="hello.jpg" alt="hello"/></span><span>Hello i\'m a "test"</span></html>',
};
const outputOptions4 = {
  'outputMethod': 'console',
};

hd.checkDefects(rules4, inputOptions4, outputOptions4);
