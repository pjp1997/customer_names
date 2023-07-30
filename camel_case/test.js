// test.js
const toCamelCase = require('./camelCase');
const canJumpToEnd = require('./jumpCheck');

const sentence = "This is an input sentence";
console.log(toCamelCase(sentence)); // Output: "thisIsAnInputSentence"

const nums = [2, 3, 1, 1, 4];
console.log(canJumpToEnd(nums)); // Output: true
