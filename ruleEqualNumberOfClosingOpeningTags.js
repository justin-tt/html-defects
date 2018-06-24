module.exports = class EqualNumberOfOpeningClosingTagsRule {
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

