import { formatPromptBody, escapeHtml, showToast } from "../js/utils.js";

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


describe("showToast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should return early if toast elements are missing", () => {
    // Override the getElementById mock to return null
    global.document.getElementById = jest.fn().mockReturnValue(null);
    showToast("Test message");
    // Nothing should throw, and no timers should be set
    expect(jest.getTimerCount()).toBe(0);
  });

  it("should set message and add show class", () => {
    const toastEl = { classList: { add: jest.fn(), remove: jest.fn() } };
    const msgEl = { textContent: "" };
    global.document.getElementById = jest.fn((id) => {
      if (id === "toast") return toastEl;
      if (id === "toastMsg") return msgEl;
      return null;
    });

    showToast("Test message");

    expect(msgEl.textContent).toBe("Test message");
    expect(toastEl.classList.add).toHaveBeenCalledWith("show");
  });

  it("should remove show class after 2500ms", () => {
    const toastEl = { classList: { add: jest.fn(), remove: jest.fn() } };
    const msgEl = { textContent: "" };
    global.document.getElementById = jest.fn((id) => {
      if (id === "toast") return toastEl;
      if (id === "toastMsg") return msgEl;
      return null;
    });

    showToast("Test message");
    expect(toastEl.classList.remove).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2500);

    expect(toastEl.classList.remove).toHaveBeenCalledWith("show");
  });
});
