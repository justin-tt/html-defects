const assert = require('assert');

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

module.exports = class TagQuantityComparisonRule {
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
