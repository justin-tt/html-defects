const assert = require('assert');
const fs = require('fs');

// assumptions: encoding in utf-8

// function to check for valid characters in
// HTML tag or attribute names
// e.g. h1, meta, data-value
// HTML 5 allows any character except any type of
// space character, ", ', <, >, /, =, control characters,
// and any non Unicode characters

const validAttributeCharCodes = [
  9, // Tab
  32, // Space
  34, // "
  39, // '
  60, // <
  62, // >
  47, // /
  61, // =
];

const isCharInCharCodeArray = function isCharInCharCodeArray(c, arr) {
  const charCode = c.charCodeAt(0);
  return !(arr.indexOf(charCode) === -1);
};
assert.deepEqual(['<'].map(
  char => (isCharInCharCodeArray(char, validAttributeCharCodes)),
),
[true]);

const isValidAttributeChar = function isValidAttributeChar(c) {
  return !isCharInCharCodeArray(c, validAttributeCharCodes);
};
assert.deepEqual(['a', 'A', '0', '-', '_', ':', '.'].map(
  char => (isValidAttributeChar(char)),
),
[true, true, true, true, true, true, true]);
assert.deepEqual([' ', '\t', '<', '>', '/', '=', '\'', '"'].map(
  char => (isValidAttributeChar(char)),
),
[false, false, false, false, false, false, false, false]);

const whiteSpaceCharCodes = [
  9, // Tab
  13, // Carriage return
  32, // Space
];
const isWhiteSpaceChar = function isWhiteSpaceChar(c) {
  return isCharInCharCodeArray(c, whiteSpaceCharCodes);
};
assert.equal(isWhiteSpaceChar('\t'), true);
assert.equal(isWhiteSpaceChar('\r'), true);

const isAprostrophe = function isAprostrophe(c) {
  return isCharInCharCodeArray(c, [34, 39]);
};
assert.equal(isAprostrophe('"'), true);
assert.equal(isAprostrophe("'"), true);
assert.equal(isAprostrophe(' '), false);


// Terminology:
// HTMLCode, HTMLTag, TagName, TagAttribute, TagAttributeValue
// HTMLTag is the <p> itself, HTMLElement is the stuff between the tags
const stripAngleBracketsFromHTMLTag = function stripAngleBracketsFromHTMLTag(HTMLTag) {
  const { length } = HTMLTag;
  return ((HTMLTag[0] === '<' && HTMLTag[length - 1] === '>')
    ? HTMLTag.slice(1, length - 1)
    : HTMLTag);
};
assert.equal(stripAngleBracketsFromHTMLTag('<html>'), 'html');
assert.equal(stripAngleBracketsFromHTMLTag('<img src="abc.jpg" alt="abc" />'), 'img src="abc.jpg" alt="abc" /');
assert.equal(stripAngleBracketsFromHTMLTag('Paragraph'), 'Paragraph');

const tokenizeStrippedHTMLTag = function tokenizeStrippedHTMLTag(strippedHTMLTag) {
  // tokenize by parsing what's in between spaces
  // complication arises due to legitimate spaces within strings
  // e.g filenames src="smiley face.jpg"
  const tokens = [];
  const stringStack = [];
  let buffer = '';

  const flushBuffer = function flushBuffer() {
    if (buffer.length !== 0) {
      tokens.push(buffer);
    }
    buffer = '';
  };

  const isAprostropheMatchingStackTop = function isAprostropheMatchingStackTop(char) {
    return (char === stringStack[stringStack.length - 1]);
  };

  for (let i = 0; i < strippedHTMLTag.length; i += 1) {
    let char = strippedHTMLTag[i];
    char = char.toLowerCase();
    if (isAprostrophe(char)) {
      if (isAprostropheMatchingStackTop(char)) {
        stringStack.pop();
      } else if (stringStack.length === 0) {
        stringStack.push(char);
      }
    }

    // if currently parsing a string
    if (stringStack.length !== 0) {
      buffer += char;
    } else if (isWhiteSpaceChar(char)) {
      flushBuffer();
    } else if (char === '=' || char === '/') {
      flushBuffer();
      buffer += char;
      flushBuffer();
    } else {
      buffer += char;
    }
  }
  flushBuffer();
  return tokens;
};

assert.deepEqual(tokenizeStrippedHTMLTag('html'), ['html']);
assert.deepEqual(tokenizeStrippedHTMLTag('/html'), ['/', 'html']);
assert.deepEqual(tokenizeStrippedHTMLTag('meta name = "descriptions" /'), ['meta', 'name', '=', '"descriptions"', '/']);
// '=' is stripped out as a token even if there is no whitespace surrounding it
assert.deepEqual(tokenizeStrippedHTMLTag('Meta name="descriptions" /'), ['meta', 'name', '=', '"descriptions"', '/']);
assert.deepEqual(tokenizeStrippedHTMLTag('img src="/test/hello 123.jpg" alt="hello" /'), ['img', 'src', '=', '"/test/hello 123.jpg"', 'alt', '=', '"hello"', '/']);
assert.deepEqual(tokenizeStrippedHTMLTag('img src="mr. foo\'s bar.jpg" alt="mrfoosbar" /'), ['img', 'src', '=', '"mr. foo\'s bar.jpg"', 'alt', '=', '"mrfoosbar"', '/']);

const isAngleBracket = function isAngleBracket(c) {
  return isCharInCharCodeArray(c, [60, 62]);
};
assert.equal(isAngleBracket('<'), true);
assert.equal(isAngleBracket('>'), true);
assert.equal(isAngleBracket('='), false);

const extractHTMLTagsFromHTMLStream = function extractHTMLTagsFromHTMLStream(readableStream) {
  let stream = '';

  const extractHTMLTags = function extractHTMLTags() {
    const HTMLTags = [];
    let isHTMLTag = false;
    let buffer = '';

    const flushBuffer = function flushBuffer() {
      if (buffer.length !== 0) {
        HTMLTags.push(buffer);
      }
      buffer = '';
    };

    for (let i = 0; i < stream.length; i += 1) {
      const char = stream[i];
      if (isAngleBracket(char)) {
        isHTMLTag = (!isHTMLTag);
      }
      if (isHTMLTag) {
        buffer += char;
      } else {
        if (char === '>') {
          buffer += char;
        }
        flushBuffer();
      }
    }
    return HTMLTags;
  };

  if (typeof readableStream === 'string') {
    stream = readableStream;
    return extractHTMLTags(stream);
  }

  // file stream or writable stream
  readableStream.setEncoding('utf8');
  readableStream.on('data', (chunk) => {
    stream += chunk;
  });
  readableStream.on('end', () => extractHTMLTags(stream));
};
assert.deepEqual(extractHTMLTagsFromHTMLStream('<html></html>'), ['<html>', '</html>']);
assert.deepEqual(extractHTMLTagsFromHTMLStream('<html><head><meta charset="utf-8"></head></html>'), ['<html>', '<head>', '<meta charset="utf-8">', '</head>', '</html>']);

const parseTokenizedHTMLTag = function parseTokenizedHTMLTag(tokenizedHTMLTag) {
  const parsedHTMLObj = {};
  const closingTagTokenPosition = tokenizedHTMLTag.indexOf('/');

  if (closingTagTokenPosition !== -1) {
    if (closingTagTokenPosition === 0) {
      parsedHTMLObj.closingTag = true;
    } else if (closingTagTokenPosition === tokenizedHTMLTag.length - 1) {
      parsedHTMLObj.selfClosingTag = true;
    }

    tokenizedHTMLTag.splice(closingTagTokenPosition, 1);
  }

  [parsedHTMLObj.elementName] = tokenizedHTMLTag;
  tokenizedHTMLTag.splice(0, 1);

  // attributes with values e.g. <img src="abc.jpg">
  parsedHTMLObj.attributes = {};
  while (tokenizedHTMLTag.indexOf('=') !== -1) {
    if (!('attributes' in parsedHTMLObj)) {
      parsedHTMLObj.attributes = {};
    }
    const equalsSignIndex = tokenizedHTMLTag.indexOf('=');
    const attributeName = tokenizedHTMLTag[equalsSignIndex - 1];
    const attributeValue = tokenizedHTMLTag[equalsSignIndex + 1];
    parsedHTMLObj.attributes[attributeName] = attributeValue;
    tokenizedHTMLTag.splice(equalsSignIndex - 1, 3);
  }
  // attributes without values e.g. <input disabled>
  if (tokenizedHTMLTag.length !== 0) {
    tokenizedHTMLTag.forEach((tag) => {
      parsedHTMLObj.attributes[tag] = null;
    });
    // parsedHTMLObj['attributesWithoutValues'] = tokenizedHTMLTag;
  }
  return parsedHTMLObj;
};
assert.deepEqual(parseTokenizedHTMLTag(['img', 'src', '=', '"/test/hello 123.jpg"', 'alt', '=', '"hello"', '/']),
  {
    elementName: 'img',
    attributes: {
      src: '"/test/hello 123.jpg"',
      alt: '"hello"',
    },
    selfClosingTag: true,
  });
assert.deepEqual(parseTokenizedHTMLTag(['div', 'data-modal-target', 'class', '=', 'dataset']),
  {
    elementName: 'div',
    attributes: {
      class: 'dataset',
      'data-modal-target': null,
    },
  });

const convertStreamToParsedHTMLTags = function convertStreamToParsedHTMLTags(stream) {
  const parsedHTMLTags = extractHTMLTagsFromHTMLStream(stream)
    .map(tag => stripAngleBracketsFromHTMLTag(tag))
    .map(tag => tokenizeStrippedHTMLTag(tag))
    .map(tag => parseTokenizedHTMLTag(tag));

  return parsedHTMLTags;
};
assert.deepEqual(convertStreamToParsedHTMLTags('<html></html>'), [{
  elementName: 'html',
  attributes: {},
}, {
  elementName: 'html',
  closingTag: true,
  attributes: {},
}]);

// Use the strategy pattern for input, output, rules
class RuleChecker {
  setRule(rule) {
    this.rule = rule;
  }

  runRule(input, options) {
    return this.rule.checkRule(input, options);
  }
}

class OutputHandler {
  setOutputMethod(outputMethod) {
    this.outputMethod = outputMethod;
  }

  writeOutput(output, outputDestination) {
    this.outputMethod.writeOutput(output, outputDestination);
  }
}

class ConsoleOutputMethod {
  writeOutput(output, outputDestination) {
    console.log(output);
  }
}

class FileOutputMethod {
  writeOutput(output, outputDestination) {
    fs.writeFile(outputDestination, output, (err) => {
      if (err) throw err;
      console.log('File saved.');
    });
  }
}

class StreamOutputMethod {
  writeOutput(output, outputDestination) {
    outputDestination.write(output);
  }
}

class InputHandler {
  setInputMethod(inputMethod) {
    this.inputMethod = inputMethod;
  }

  readInput(input) {
    return this.inputMethod.readInput(input);
  }
}

class StringInputMethod {
  readInput(input) {
    return input;
  }
}

class FileInputMethod {
  readInput(input) {
    const fileString = fs.readFileSync(input);
    return fileString;
  }
}

class StreamInputMethod {
  readInput(input) {
    let streamString = '';
    input.on('data', (chunk) => {
      streamString += chunk;
    });

    return (new Promise((resolve, reject) => {
      input.on('end', () => {
        resolve(streamString);
      });
    }));
  }
}

// like 'main'
const checkDefects = function checkDefects(rules, inputOptions, outputOptions) {
  const inputMap = {
    string: new StringInputMethod(),
    file: new FileInputMethod(),
    stream: new StreamInputMethod(),
  };


  const parseInput = function (input) {
    input = input ? input.toString() : '';
    input = convertStreamToParsedHTMLTags(input);
    output = '';

    const outputMap = {
      console: new ConsoleOutputMethod(),
      file: new FileOutputMethod(),
      stream: new StreamOutputMethod(),
    };

    const checker = new RuleChecker();
    for (const rule of rules) {
    // for (const rule of Object.keys(rules)) {
      checker.setRule(rule.definition);
      output += checker.runRule(input, rule.options);
      output += '\n';
    }

    const outputHandler = new OutputHandler();
    outputHandler.setOutputMethod(outputMap[outputOptions.outputMethod]);
    outputHandler.writeOutput(output, outputOptions.destination);
  };
  const inputHandler = new InputHandler();
  inputHandler.setInputMethod(inputMap[inputOptions.inputMethod]);
  input = inputHandler.readInput(inputOptions.source);
  if (typeof input.then === 'function') {
    input.then((input) => {
      parseInput(input);
    });
  } else {
    parseInput(input);
  }
};

module.exports.checkDefects = checkDefects;
