module.exports = class HeaderWithoutTagsRule {

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
            if (!attributeValueRequired) {
              return true;
            }
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
