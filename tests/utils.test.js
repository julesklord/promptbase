import { formatPromptBody, escapeHtml, animateNum } from "../js/utils.js";

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

describe("animateNum", () => {
  let mockElement;

  beforeEach(() => {
    jest.useFakeTimers();
    mockElement = { textContent: 0 };
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'test-id') return mockElement;
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should return immediately if element is not found", () => {
    animateNum('non-existent', 100);
    // Fast-forward time to ensure no interval is running
    jest.advanceTimersByTime(100);
    expect(mockElement.textContent).toBe(0); // Remains unchanged
  });

  it("should animate number from 0 to target correctly", () => {
    animateNum('test-id', 100);

    // Initial state
    expect(mockElement.textContent).toBe(0);

    // Step size for 100 is Math.ceil(100 / 30) = 4
    // Advance 1 interval (30ms) -> cur = 4
    jest.advanceTimersByTime(30);
    expect(mockElement.textContent).toBe(4);

    // Advance 5 more intervals (150ms) -> cur = 4 + (5 * 4) = 24
    jest.advanceTimersByTime(150);
    expect(mockElement.textContent).toBe(24);

    // Run remaining timers to completion
    jest.runAllTimers();
    expect(mockElement.textContent).toBe(100);
  });

  it("should handle targets smaller than 30", () => {
    animateNum('test-id', 15);

    // Step size for 15 is Math.ceil(15 / 30) = 1
    jest.advanceTimersByTime(30);
    expect(mockElement.textContent).toBe(1);

    jest.runAllTimers();
    expect(mockElement.textContent).toBe(15);
  });
});
