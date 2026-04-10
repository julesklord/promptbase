const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Extract pure functions from utils.js since it's not set up as a standard module format for Node.
function getUtils() {
  const code = fs.readFileSync(path.join(process.cwd(), 'js', 'utils.js'), 'utf8');
  const transformedCode = code.replace(/export function /g, 'function ');
  const evaluator = new Function(transformedCode + '; return { formatPromptBody, escHtml };');
  return evaluator();
}

const { formatPromptBody } = getUtils();

test.describe('Utils: formatPromptBody', () => {

  test('should return empty string when given empty string', () => {
    const result = formatPromptBody('');
    expect(result).toBe('');
  });

  test('should return plain text unchanged', () => {
    const result = formatPromptBody('Hello world');
    expect(result).toBe('Hello world');
  });

  test('should escape HTML characters & < >', () => {
    const result = formatPromptBody('Bread & Butter < Test >');
    expect(result).toBe('Bread &amp; Butter &lt; Test &gt;');
  });

  test('should format bold text correctly', () => {
    const result = formatPromptBody('This is **bold** text.');
    expect(result).toBe('This is <strong style="color:var(--text)">bold</strong> text.');
  });

  test('should format inline code correctly', () => {
    const result = formatPromptBody('Use `const x = 5;`');
    expect(result).toBe('Use <code class="inline-code">const x = 5;</code>');
  });

  test('should wrap xml-like tags in span', () => {
    const result = formatPromptBody('Here is a <tag> and </tag>');
    expect(result).toBe('Here is a <span class="xml-tag">&lt;tag&gt;</span> and <span class="xml-tag">&lt;/tag&gt;</span>');
  });

  test('should format complex combinations', () => {
    const result = formatPromptBody('**Bold** and `code` with <xml> tag & stuff.');
    expect(result).toBe('<strong style="color:var(--text)">Bold</strong> and <code class="inline-code">code</code> with <span class="xml-tag">&lt;xml&gt;</span> tag &amp; stuff.');
  });

  test('should handle unmatched markers gracefully', () => {
    const result = formatPromptBody('Unmatched **bold and `code');
    expect(result).toBe('Unmatched **bold and `code');
  });

  test('should handle multiple bold and code blocks', () => {
    const result = formatPromptBody('**One** and **Two**, `foo` and `bar`');
    expect(result).toBe('<strong style="color:var(--text)">One</strong> and <strong style="color:var(--text)">Two</strong>, <code class="inline-code">foo</code> and <code class="inline-code">bar</code>');
  });

  test('should handle malformed XML-like tags', () => {
    const result = formatPromptBody('Start <foo bar="1"> End');
    expect(result).toBe('Start &lt;foo bar="1"&gt; End');
  });
});
