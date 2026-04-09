export function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatPromptBody(str) {
  let esc = escHtml(str);
  esc = esc.replace(/(&lt;\/?\w+&gt;)/gi, '<span class="xml-tag">$1</span>');
  esc = esc.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text)">$1</strong>');
  esc = esc.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  return esc;
}

export function showToast(msg) {
  const t = document.getElementById("toast");
  const msgEl = document.getElementById("toastMsg");
  if (!t || !msgEl) return;
  msgEl.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

export function animateNum(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const step = Math.ceil(target / 30) || 1;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(t);
  }, 30);
}
