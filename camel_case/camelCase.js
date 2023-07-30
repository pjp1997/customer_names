// camelCase.js
function toCamelCase(sentence) {
    const words = sentence.split(' ');
    const camelCaseWords = words.map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return camelCaseWords.join('');
  }
  
  module.exports = toCamelCase;
  