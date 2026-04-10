// @ts-check
import { test, expect } from "@playwright/test";
import { formatPromptBody } from "../js/utils.js";

test.describe("formatPromptBody", () => {
  test("handles empty string safely", () => {
    expect(formatPromptBody("")).toBe("");
  });

  test("replaces basic HTML special characters properly", () => {
    expect(formatPromptBody("A & B < C > D")).toBe("A &amp; B &lt; C &gt; D");
  });

  test("replaces markdown bold with span", () => {
    expect(formatPromptBody("**bold text**")).toBe(
      '<strong style="color:var(--text)">bold text</strong>',
    );
  });

  test("replaces inline code with code block", () => {
    expect(formatPromptBody("`code`")).toBe('<code class="inline-code">code</code>');
  });

  test("replaces xml tags with span", () => {
    expect(formatPromptBody("<tag>")).toBe('<span class="xml-tag">&lt;tag&gt;</span>');
    expect(formatPromptBody("</tag>")).toBe('<span class="xml-tag">&lt;/tag&gt;</span>');
  });

  test("handles multiple bold matches", () => {
    expect(formatPromptBody("**one** and **two**")).toBe(
      '<strong style="color:var(--text)">one</strong> and <strong style="color:var(--text)">two</strong>',
    );
  });

  test("handles multiple code matches", () => {
    expect(formatPromptBody("`one` and `two`")).toBe(
      '<code class="inline-code">one</code> and <code class="inline-code">two</code>',
    );
  });

  test("handles multiple xml matches", () => {
    expect(formatPromptBody("<tag1> and <tag2>")).toBe(
      '<span class="xml-tag">&lt;tag1&gt;</span> and <span class="xml-tag">&lt;tag2&gt;</span>',
    );
  });

  test("handles complex string with multiple formats", () => {
    const input = "<tag> **bold** `code` & </tag>";
    const expected =
      '<span class="xml-tag">&lt;tag&gt;</span> <strong style="color:var(--text)">bold</strong> <code class="inline-code">code</code> &amp; <span class="xml-tag">&lt;/tag&gt;</span>';
    expect(formatPromptBody(input)).toBe(expected);
  });

  test("does not modify string without matches", () => {
    expect(formatPromptBody("Just a normal string")).toBe("Just a normal string");
  });

  test("handles malformed bold tags", () => {
    expect(formatPromptBody("**unfinished bold")).toBe("**unfinished bold");
  });

  test("handles malformed inline code tags", () => {
    expect(formatPromptBody("`unfinished code")).toBe("`unfinished code");
  });

  test("handles consecutive markers", () => {
    expect(formatPromptBody("****")).toBe('<strong style="color:var(--text)"></strong>');
    expect(formatPromptBody("``")).toBe("``"); // No match because `([^`]+)` requires at least one character
  });

  test("leaves xml tags with attributes as escaped html", () => {
    expect(formatPromptBody('<tag id="1">')).toBe('&lt;tag id="1"&gt;');
  });

  test("handles multiline strings", () => {
    const input = `line1\n**bold**\nline3`;
    const expected = `line1\n<strong style="color:var(--text)">bold</strong>\nline3`;
    expect(formatPromptBody(input)).toBe(expected);
  });
});
