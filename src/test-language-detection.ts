import { detectLanguage, detectLanguageWithPatterns, detectLanguageWithHighlightJS } from './lib/languageDetection';

// Test cases
const testCases = [
  {
    name: 'JavaScript',
    code: 'function hello() { console.log("Hello World"); }'
  },
  {
    name: 'Python',
    code: 'def hello():\n    print("Hello World")'
  },
  {
    name: 'Java',
    code: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}'
  },
  {
    name: 'SQL',
    code: 'SELECT * FROM users WHERE id = 1;'
  },
  {
    name: 'HTML',
    code: '<div class="container"><h1>Hello World</h1></div>'
  }
];

console.log('Testing language detection:');
testCases.forEach(testCase => {
  const patternResult = detectLanguageWithPatterns(testCase.code);
  const highlightResult = detectLanguageWithHighlightJS(testCase.code);
  const finalResult = detectLanguage(testCase.code);
  
  console.log(`\n${testCase.name}:`);
  console.log(`  Pattern detection: ${patternResult}`);
  console.log(`  Highlight.js detection: ${highlightResult}`);
  console.log(`  Final detection: ${finalResult}`);
});