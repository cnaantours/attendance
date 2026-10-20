/* קריאה לשרת. בקשת POST "פשוטה" (text/plain) כדי שהדפדפן לא ידרוש preflight. */
window.api = async function (fn, ...args) {
  let res;
  const ctl = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = ctl ? setTimeout(() => ctl.abort(), 30000) : 0;
  try {
    res = await fetch(window.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn, args }),
      redirect: 'follow',
      signal: ctl ? ctl.signal : undefined
    });
  } catch (e) {
    throw new Error(e && e.name === 'AbortError' ? 'השרת לא ענה בזמן. נסו שוב.' : 'אין חיבור לשרת. בדקו את האינטרנט ונסו שוב.');
  } finally {
    clearTimeout(timer);
  }
  let out;
  try { out = await res.json(); } catch (e) { throw new Error('תשובה לא צפויה מהשרת. נסו שוב בעוד רגע.'); }
  if (!out.ok) throw new Error(out.error || 'שגיאה');
  return out.data;
};
