/* קריאה לשרת (Apps Script). בקשת POST "פשוטה" (text/plain) כדי שהדפדפן לא ידרוש preflight. */
window.api = async function (fn, ...args) {
  let res;
  try {
    res = await fetch(window.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn, args }),
      redirect: 'follow'
    });
  } catch (e) {
    throw new Error('אין חיבור לשרת. בדקו את האינטרנט ונסו שוב.');
  }
  let out;
  try { out = await res.json(); } catch (e) { throw new Error('תשובה לא צפויה מהשרת. נסו שוב בעוד רגע.'); }
  if (!out.ok) throw new Error(out.error || 'שגיאה');
  return out.data;
};
