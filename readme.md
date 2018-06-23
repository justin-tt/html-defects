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

hd.checkDefects(rules, input, outputOptions);
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
```javascript
npm run test
```

Check out test.js for more examples.

