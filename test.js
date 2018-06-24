const fs = require('fs');
const hd = require('./html-defects.js');
const assert = require('assert');


class TagsWithoutAttributesRule {
  checkRule(input, options) {
    let output = '';

    output += 'Checking \'tags without attributes\' rule:\n';

    for (const option of options) {
      for (const elementName of Object.keys(option)) {
        const attributeName = option[elementName];
        const defectCount = input.filter(tag => (tag.elementName === elementName))
          .filter(tag => !(Object.keys(tag).includes('closingTag')))
          .filter(tag => !(Object.keys(tag.attributes).includes(attributeName)))
          .length;

        if (defectCount !== 0) {
          output += `<${elementName}> tags without ${attributeName} attribute: ${defectCount}\n`;
        }
      }
    }
    return output;
  }
}
class HeaderWithoutTagsRule {

  checkRule(input, options) {
    let output = '';
    const surroundingTag = 'head';

    output += 'Checking \'header without tags\' rule:\n';

    const filterElementsWithinTag = function filterElementsWithinTag(input, tagName) {
      // filter out elements inside head tag
      // assuming that there is only one head tag
      const headTagStartIndex = input.findIndex(tag => (tag.elementName === tagName));
      const headTagEndIndex = input.findIndex(tag => (tag.elementName === tagName && tag.closingTag === true));
      input = input.slice(headTagStartIndex + 1, headTagEndIndex);
      return input;
    };
    input = filterElementsWithinTag(input, surroundingTag);

    for (const option of options) {
      for (const elementName of Object.keys(option)) {
        const attributeRequired = Object.keys(option[elementName])[0];
        const attributeValueRequired = option[elementName][attributeRequired];
        const attributeRequiredCount = input.filter(tag => (tag.elementName === elementName))
          .filter((tag) => {
            if (tag.attributes[attributeRequired] !== undefined) {
              return tag.attributes[attributeRequired] === attributeValueRequired;
            }
            return false;
          })
          .length;

        if (attributeRequiredCount === 0) {
          output += `Header tag does not have <${elementName}${attributeRequired ? ` ${attributeRequired}=${attributeValueRequired}` : ''}>\n`;
        }
      }
    }
    return output;
  }
}

const compareQuantityMap = {
  '<': (x, y) => x < y,
  '>': (x, y) => x > y,
  '==': (x, y) => x === y,
  '>=': (x, y) => x >= y,
  '<=': (x, y) => x <= y,
  '!=': (x, y) => x !== y,
};

const compareQuantity = function compareQuantity(x, y, comparisonOperator) {
  return compareQuantityMap[comparisonOperator](x, y);
};
assert.equal(compareQuantity(1, 2, '<'), true);
assert.equal(compareQuantity(5, 2, '>'), true);
assert.equal(compareQuantity(2, 2, '>='), true);
assert.equal(compareQuantity(2, 2, '<='), true);
assert.equal(compareQuantity(2, 2, '=='), true);
assert.equal(compareQuantity(5, 2, '!='), true);


class TagQuantityComparisonRule {
  checkRule(input, options) {
    let output = '';
    const surroundingTag = 'html';

    output += 'Checking \'tag quantity comparison\' rule:\n';

    const filterElementsWithinTag = function filterElementsWithinTag(input, tagName) {
      // filter out elements inside head tag
      // assuming that there is only one head tag
      const headTagStartIndex = input.findIndex(tag => tag.elementName === tagName);
      const headTagEndIndex = input.findIndex(tag => (tag.elementName === tagName) && tag.closingTag === true);
      input = input.slice(headTagStartIndex + 1, headTagEndIndex);
      return input;
    };
    input = filterElementsWithinTag(input, surroundingTag);

    for (const option of options) {
      const tagCount = input.filter(tag => (tag.elementName === option.elementName && !tag.closingTag))
        .length;

      if (compareQuantity(tagCount, option.quantity, option.comparisonOperator)) {
        output += `In <${surroundingTag}>: Quantity of <${option.elementName}> tags is ${option.comparisonOperator} ${option.quantity}\n`;
      }
      // assert option contains keys comparisonOperator,
      // elementName, quantity
      // throw errors
    }

    return output;
  }
}

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
let challengeRules = {
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


class EqualNumberOfOpeningClosingTagsRule {
    checkRule(input, options) {
        let output = '';
        output += `Checking that elements have equal numbers of opening and closing tags\n`;

        // iterate over each option object within options
        // array for each variation of the rule
        for (const option of options) {
            const elementName = option.name;
            const openingTagCount = input.filter(tag => (
                tag.elementName === elementName && !tag.closingTag
            )).length;
            const closingTagCount = input.filter(tag => (
                tag.elementName === elementName && tag.closingTag
            )).length;

            if (openingTagCount !== closingTagCount) {
                output += `Unequal counts of opening and closing tags for <${elementName}>\n`;
                output += `Opening: ${openingTagCount}\n`;
                output += `Closing: ${closingTagCount}\n`;
            }
        }

        return output;
    }
}


challengeRules = [
  {
    rule: new EqualNumberOfOpeningClosingTagsRule(),
    options: [
        {
            name: 'html'
        },
        {
            name: 'div'
        }
    ]
  },
  {
    rule: new HeaderWithoutTagsRule(),
    options: [
      {
        meta: {
          name: '"keywords"'
        }
      },
      {
        meta: {
          name: '"descriptions"'
        }
      }
    ]
  }
]


const challengeInputOptions = {
  inputMethod: 'string',
  source: '<html><head><meta name="descriptions"><meta charset="utf-8"></head><span data-node class="c1 c2"><img src="hello.jpg" /><img src="hello.jpg" alt="hello"/></span><span>Hello i\'m a "test"</span><div></html>',
};
const challengeOutputOptions = {
  outputMethod: 'console',
};

hd.checkDefects(challengeRules, challengeInputOptions, challengeOutputOptions);
