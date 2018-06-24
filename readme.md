# Installation

```javascript
npm install --save @jgch/html-defects
```

# Getting started

```javascript
const hd = require('@jgch/html-defects');

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
	source: '<html><img src="foo.jpg" /></html>',
	
}

const outputOptions = {
	outputMethod: 'console'
}

hd.checkDefects(rules, inputOptions, outputOptions);
```

# Rules
The rules object can have any of these keys:
1. tagsWithoutAttributes
2. headerWithoutTags
3. tagQuantityComparison

Each rule key contains an array of options.

## Tags without attributes
This counts the number of tags that do not have a specified attribute.

```javascript
// Look for <a> tags that do not contain *rel* attribute.
tagsWithoutAttributes: [
	{
		a: 'rel'
	}
]
```

## Header not containing tags
This shows if specified tags are missing in the HTML header.

```javascript
// Check for missing <title> tags,
// missing <meta name="descriptions"> tags
// and missing <meta name="keywords"> tags.
headerWithoutTags: [
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
```

## Tag Quantity Comparison
This compares the quantity of specified tags against a specified quantity given a specified comparison operator.

```javascript
// Check if there are more than 15 <strong> tags,
// and check if there is more than 1 <h1> tag.
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
	}
]
```
# Input options
Specify the input source.
## HTML File
```javascript
// To read from a file.
inputOptions = {
	inputMethod: 'file',
	source: 'foo.html'
}
```
## Readable Stream
```javascript
// To read from a stream.
const readableStream = fs.createReadStream('test.html');
inputOptions = {
	inputMethod: 'stream',
	source: readableStream
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
	destination: writableStream
}
```

# Test
Check out test.js (within /node_modules/@jgch/html-defects) for more examples.

# Extending custom rules
Create a custom rule by defining a Rule class that implements the checkRule(input, options) method which returns an output string. This class must be instantiated within each rule within the rule object.

## Implementing checkRule(input, options)
To make it easier to implement a custom rule, you are free to define the structure of the options object to be passed to the rule checker, as well as an input array, which contains a parsed array of HTML elements. 

### The input argument
The input argument is an array of objects, and each object represents a parsed HTML tag.

The object consists of the following keys:
```
elementName
attributes
closingTag
selfClosingTag
```
To illustrate this with some examples:

`<html>`
is parsed into
```
{
    elementName: 'html',
    attributes: {}
}
```

`</head>`
is parsed into
```
{
    elementName: 'head',
    attributes: {},
    closingTag: true
}
```

`<img src="hello.jpg" alt="hello" />`
is parsed into 
```
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
```
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

```
[
    {
        img: 'alt',
    },
    {
        a: 'rel',
    }
]

This gives rise to two variations of an abstract rule, where we could be looking for a particular tag, that does not contain a particular attribute. This is easy to implement by looping over each of the parsed input HTML objects, searching its elementName for the option's key, followed by searching its attributes for the option's key's value.

You can define the option object to take any form, as long as you implement the logic required to use this option object. See the section on 'Example of custom rule creation' for more info.
```

### The return value
Within the checkRule method, you should have a return statement that returns a string which contains information about the status of your rule when applied to the relevant html parsed html tags.

# Example of custom rule creation

## Rule definition
Let's say we wish to create a rule that checks if a given element name has an equal number of closing tags.

## Options
We can turn this abstraction into a concrete option by allowing the user to specify the name of the tag.

A concrete object representing this abstraction could look like:

```
{
    name: 'html'
}
```

and another variation could look like:
```
{
    name: 'div'
}
```

We can create an options array to hold these two variants:
```
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

We need to implement the checkRule method, which gives us access to the input and options (see sections above). We also need to return an output string that lets us know the outcome of the rule after checking.

Loop over each of the variations in the array, and count the number of each element and its opening/closing tags using the Array.prototype.filter method.

Add output text.

```
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
```

## Defining the rules object
