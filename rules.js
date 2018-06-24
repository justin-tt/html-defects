const EqualNumberOfClosingOpeningTagsRule = require('./ruleEqualNumberOfClosingOpeningTags.js');
const TagsWithoutAttributesRule = require('./ruleTagsWithoutAttributes.js');
const HeaderWithoutTagsRule = require('./ruleHeaderWithoutTags.js');
const TagQuantityComparisonRule = require('./ruleTagQuantityComparison.js');

module.exports = [
  {
    definition: new EqualNumberOfClosingOpeningTagsRule(),
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
    definition: new HeaderWithoutTagsRule(),
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
