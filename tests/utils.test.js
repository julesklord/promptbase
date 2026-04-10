import { formatPromptBody, escapeHtml } from "../js/utils.js";

// Note: Since utils.js uses ES Modules and we are in a hybrid environment, 
// we might need to mock or transform. For now, assuming standard Jest/ESM setup.

describe("formatPromptBody", () => {
  it("should format XML tags", () => {
    const input = "<system>test</system>";
    const output = formatPromptBody(input);
    expect(output).toContain('class="xml-tag"');
    expect(output).toContain("&lt;system&gt;");
  });

  it("should format bold text", () => {
    const input = "Hello **world**";
    const output = formatPromptBody(input);
    expect(output).toContain("<strong");
    expect(output).toContain("world");
  });

  it("should format inline code", () => {
    const input = "Use `code` here";
    const output = formatPromptBody(input);
    expect(output).toContain("<code");
    expect(output).toContain("code");
  });

  it("should escape other HTML tags in body", () => {
    const input = "<script>alert(1)</script>";
    const output = formatPromptBody(input);
    expect(output).not.toContain("<script>");
    expect(output).toContain("&lt;script&gt;");
  });
});

describe("escapeHtml", () => {
  it("should escape special characters", () => {
    expect(escapeHtml("<b>")).toBe("&lt;b&gt;");
    expect(escapeHtml('"quote"')).toBe("&quot;quote&quot;");
    expect(escapeHtml("'single'")).toBe("&#39;single&#39;");
    expect(escapeHtml("&")).toBe("&amp;");
  });
});
