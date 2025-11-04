// Utility functions for detecting programming languages from code content
import hljs from 'highlight.js';

// Function to detect language using highlight.js
export const detectLanguageWithHighlightJS = (code: string): string => {
  try {
    const result = hljs.highlightAuto(code);
    return result.language || 'text';
  } catch (error) {
    console.warn('Language detection failed:', error);
    return 'text';
  }
};

// Function to detect language using our custom patterns
export const detectLanguageWithPatterns = (code: string): string => {
  // Check for specific language patterns
  const patterns: { [key: string]: RegExp } = {
    javascript: /\b(function|var|let|const|console\.log|=>|import\s+|export\s+)/i,
    typescript: /\b(interface|type\s+\w+\s*=|as\s+const|public\s+|private\s+|protected\s+)/i,
    python: /\b(def\s+\w+|import\s+\w+|from\s+\w+\s+import|class\s+\w+:|print\(|if\s+__name__\s*==\s*['"]__main__['"])/i,
    java: /\b(public\s+|class\s+\w+|package\s+\w+|import\s+java\.|System\.out\.|static\s+void\s+main)/i,
    cpp: /\b(#include\s*<|using\s+namespace\s+std|std::cout|std::cin|int\s+main\(\))/i,
    c: /\b(#include\s*<|printf\(|scanf\(|int\s+main\(\))/i,
    sql: /\b(SELECT\s+|INSERT\s+INTO|UPDATE\s+|DELETE\s+FROM|CREATE\s+TABLE|DROP\s+TABLE)/i,
    html: /<(div|span|p|a\s+href|html|head|body|script|link)/i,
    css: /(\w+)\s*{\s*(\w+:\s*\w+;?)+\s*}/,
    json: /^\s*[{[]/,
    php: /<\?php|echo\s+|function\s+\w+\s*\(|\$_(GET|POST|SESSION)/i,
    ruby: /\b(def\s+\w+|class\s+\w+|puts\s+|require\s+|rails)/i,
    go: /\b(package\s+main|import\s+|func\s+\w+|fmt\.Print|go\s+func)/i,
    rust: /\b(fn\s+main\(\)|let\s+mut\s+|use\s+std::|println!\()/i,
    swift: /\b(func\s+\w+|import\s+UIKit|class\s+\w+:\s*UIViewController)/i,
    kotlin: /\b(fun\s+\w+|class\s+\w+|import\s+kotlin\.|val\s+\w+)/i,
  };

  // Check for specific patterns first
  for (const [language, pattern] of Object.entries(patterns)) {
    if (pattern.test(code)) {
      return language;
    }
  }

  // Default to text if no patterns match
  return 'text';
};

// Main function to detect language
export const detectLanguage = (code: string): string => {
  // First try our pattern-based detection
  const patternResult = detectLanguageWithPatterns(code);
  
  // If we get a generic result, try highlight.js for better accuracy
  if (patternResult === 'text' && code.length > 10) {
    return detectLanguageWithHighlightJS(code);
  }
  
  return patternResult;
};

// Function to get language based on file extension
export const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.toLowerCase();
  if (ext.endsWith('.js') || ext.endsWith('.jsx')) return 'javascript';
  if (ext.endsWith('.ts') || ext.endsWith('.tsx')) return 'typescript';
  if (ext.endsWith('.py')) return 'python';
  if (ext.endsWith('.java')) return 'java';
  if (ext.endsWith('.cpp') || ext.endsWith('.c') || ext.endsWith('.h')) return 'cpp';
  if (ext.endsWith('.css')) return 'css';
  if (ext.endsWith('.html') || ext.endsWith('.htm')) return 'html';
  if (ext.endsWith('.json')) return 'json';
  if (ext.endsWith('.xml')) return 'xml';
  if (ext.endsWith('.md')) return 'markdown';
  if (ext.endsWith('.sql')) return 'sql';
  if (ext.endsWith('.php')) return 'php';
  if (ext.endsWith('.rb')) return 'ruby';
  if (ext.endsWith('.go')) return 'go';
  if (ext.endsWith('.rs')) return 'rust';
  if (ext.endsWith('.swift')) return 'swift';
  if (ext.endsWith('.kt')) return 'kotlin';
  return 'text';
};

// Function to get language display name
export const getLanguageDisplayName = (language: string): string => {
  const displayNames: { [key: string]: string } = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    sql: 'SQL',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    xml: 'XML',
    markdown: 'Markdown',
    php: 'PHP',
    ruby: 'Ruby',
    go: 'Go',
    rust: 'Rust',
    swift: 'Swift',
    kotlin: 'Kotlin',
    text: 'Plain Text'
  };

  return displayNames[language] || language.charAt(0).toUpperCase() + language.slice(1);
};