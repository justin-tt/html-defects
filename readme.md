# Installation

```javascript
npm install --save @jgch/html-defects
```

# Getting started

```javascript
// The defect checker module
const hd = require('@jgch/html-defects');

// The rule classes
const TagsWithoutAttributesRule = require('./ruleTagsWithoutAttributes.js');

// Instantiating the rules with options
const rules = [
  {
    definition: new TagsWithoutAttributesRule(),
    options: [
      {
        img: 'alt',
      },
      {
        a: 'rel',
      },
    ],
  },
];

// Specifying input method and source
const inputOptions = {
  inputMethod: 'string',
  source: '<html><img src="foo.jpg" /></html>',
};

// Specifying output method and destination
const outputOptions = {
  outputMethod: 'console',
};

hd.checkDefects(rules, inputOptions, outputOptions);
```

# Rules
## Creating the rules array
You can define as many rules and their respective options within an array, which will be passed into the defect checker module.

Each rule within the rules array is a rule object with two properties:
1. definition
2. options

```
  {
    definition: new TagsWithoutAttributesRule(),
    options: [
      {
        img: 'alt',
      },
      {
        a: 'rel',
      },
    ],
  },
```

## definition
The definition instantiates a predefined rule class.

This package comes with 4 predefined rule classes:
1. TagsWithoutAttributesRule
2. HeaderWithoutTagsRule
3. TagQuantityComparisonRule
4. EqualNumberOfOpeningClosingTagsRule (see creating custom rules section)

You can examine the source code for each of these rule classes, e.g. ruleTagsWithoutAttributes.js if you wish to modify its implementation.

## options
The options key consists of an array with individual option objects. The structure of these options depends on the corresponding rule classes.

# Using predefined rules
## Tags without attributes
This counts the number of tags that do not have a specified attribute.

Option usage:

```javascript
// Look for <a> tags that do not contain *rel* attribute.
{
    definition: new TagsWithoutAttributesRule(),
    options: [
    	{
    		a: 'rel',
    	},
    ],
}
```

## Header not containing tags
This shows if specified tags are missing in the HTML header.

```javascript
// This example uses 3 different option objects to run the same rule with different variations.
// Check for missing <title> tags,
// missing <meta name="descriptions"> tags
// and missing <meta name="keywords"> tags.
{
    definition: new HeaderWithoutTagsRule(),
    options: [
    	{
    		title: {}
    	},
    	{
    		meta: {
    			name: '"descriptions"', // observe the quotation marks!
    		}
    	},
    	{
    		meta: {
    			name: '"keywords"',
    		}
    	}
    ]
}
```

## Tag Quantity Comparison
This compares the quantity of specified tags against a specified quantity given a specified comparison operator.

```javascript
// Check if there are more than 15 <strong> tags,
// and check if there is more than 1 <h1> tag.
{
    definition: new TagQuantityComparisonRule(),
    options: [
    	{
    		comparisonOperator: '>',
    		elementName: 'strong',
    		quantity: 15,
    	},
    	{
    		comparisonOperator: '>',
    		elementName: 'h1',
    		quantity: 1,
    	}
    ]
}
```

# Using multiple rules

An example of a rules array containing multiple predefined rules that can be passed into the defects checker.

```javascript
const rules = [
  {
    definition: new TagsWithoutAttributesRule(),
    options: [
      {
        img: 'alt',
        a: 'rel',
      },
    ],
  },
  {
    definition: new HeaderWithoutTagsRule(),
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
    ]
  },
  {
    definition: new TagQuantityComparisonRule(),
    options: [
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
  },
];
```

# Input options
Specify the input source.
## HTML File
```javascript
// To read from a file.
inputOptions = {
	inputMethod: 'file',
	source: 'foo.html',
}
```
## Readable Stream
```javascript
// To read from a stream.
const readableStream = fs.createReadStream('test.html');
inputOptions = {
	inputMethod: 'stream',
	source: readableStream,
}
```
## String
```javascript
// Read from a html string.
inputOptions = {
    inputMethod: 'string',
    source: '<html></html>',
}
```


# Output options
Specify whether to output to a file, a node writable stream or console.
## Console
```javascript
// To write to the console.
outputOptions = {
	outputMethod: 'console'
}
```
## File
```javascript
// To write to a file, specify the filename in the 'destination' key.
outputOptions = {
	outputMethod: 'file',
	destination: 'defectsFile.txt'
}
```

## Writable Stream
```javascript
// To write to a node writable stream, specify the stream in the 'destination' key.
const writableStream = fs.createWriteStream('defectsStream.txt')
outputOptions = {
	outputMethod: 'stream',
	destination: writableStream,
}
```

# Example
*test.js*
```javascript
const fs = require('fs');
const hd = require('@jgch/html-defects.js');

const TagsWithoutAttributesRule = require('./ruleTagsWithoutAttributes.js');
const HeaderWithoutTagsRule = require('./ruleHeaderWithoutTags.js');
const TagQuantityComparisonRule = require('./ruleTagQuantityComparison.js');


const rules = [
  {
    definition: new TagsWithoutAttributesRule(),
    options: [
      {
        img: 'alt',
        a: 'rel',
      },
    ],
  },
  {
    definition: new HeaderWithoutTagsRule(),
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
    ]
  },
  {
    definition: new TagQuantityComparisonRule(),
    options: [
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
  },
];

const inputOptions = {
  inputMethod: 'file',
  source: 'test.html',
};

const outputOptions = {
  outputMethod: 'file',
  destination: 'results.txt',
};

hd.checkDefects(rules, inputOptions, outputOptions);
```

# Extending custom rules
Create a custom rule by defining a Rule class that implements the checkRule(input, options) method which returns an output string. This class must be instantiated within each rule within the rule object.

## Implementing checkRule(input, options)
To make it easier to implement a custom rule, you are free to define the structure of the options object to be passed to the rule checker, as well as an input array, which contains a parsed array of HTML elements. 

### The input argument
The input argument is an array of objects, and each object represents a parsed HTML tag.

The object consists of the following keys:
```javascript
elementName
attributes
closingTag
selfClosingTag
```
To illustrate this with some examples:

`<html>`
is parsed into
```javascript
{
    elementName: 'html',
    attributes: {}
}
```

`</head>`
is parsed into
```javascript
{
    elementName: 'head',
    attributes: {},
    closingTag: true
}
```

`<img src="hello.jpg" alt="hello" />`
is parsed into 
```javascript
{
    selfClosingTag: true,
    elementName: 'img',
    attributes: {
        src: '"hello.jpg"',
        alt: '"hello"'
    }

}
```

`<span data-node class="c1 c2">`
is parsed into
```javascript
{
    elementName: 'span',
    attributes: {
        class: '"c1 c2"',
        'data-node': null
    }
}
```

The elementName and attributes property will always be present, and the attributes property will be an empty object if there are no attributes. The selfClosingTag and closingTag properties only appear if the element contains the / character within the tag (at the back and at the front respectively).

### The options argument
The options argument is an array of various objects which will be iterated over within the main checkDefects method.

The each option object will contain details specific to each *variation* of the same rule.

For example, in our 'tagsWithoutAttributes' rule, we specified the following options: 

```javascript
[
    {
        img: 'alt',
    },
    {
        a: 'rel',
    }
]
```

This gives rise to two variations of an abstract rule, where we could be looking for a particular tag, that does not contain a particular attribute. This is easy to implement by looping over each of the parsed input HTML objects, searching its elementName for the option's key, followed by searching its attributes for the option's key's value.

You can define the option object to take any form, as long as you implement the logic required to use this option object. See the section on 'Example of custom rule creation' for more info.

### The return value
Within the checkRule method, you should have a return statement that returns a string which contains information about the status of your rule when applied to the relevant html parsed html tags.

# Example of custom rule creation

## Rule definition
Let's say we wish to create a rule that checks if a given element name has an equal number of opening and closing tags.

## Options
We can turn this abstraction into a concrete option by allowing the user to specify the name of the tag.

A concrete object representing this abstraction could look like:

```javascript
{
    name: 'html'
}
```

and another variation could look like:
```javascript
{
    name: 'div'
}
```

We can create an options array to hold these two concrete variants:
```javascript
options: [
    {
        name: 'html'
    },
    {
        name: 'div'
    }
]
```

This abstraction is simple enough for our rule, since all our rule needs to know is the name of the tag.

Our rule will check through each of these option variants.

## Implementing the rule class
Let's create our rule class to implement the logic behind this rule.

We need to implement the checkRule method, which gives us access to the input HTML and options (see sections above). We also need to return an output string that lets us know the outcome of the rule after checking.

Implementation details:
Loop over each of the option variations in the array. For each option's specified element, count the number of opening/closing tags for each element by filtering the input elements and getting the filtered input's length.

Add output text to show if the tag counts match or mismatch.

*ruleEqualNumberOfClosingOpeningTags.js*
```javascript
// create rule class as a module
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
```

## Using our rule class
*exampleUsage.js*
```javascript
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
```
