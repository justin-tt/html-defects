module.exports = class TagsWithoutAttributesRule {
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
