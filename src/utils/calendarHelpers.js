/**
 * Generate a 6-row × 7-column grid for a given month.
 * Each cell is { date, inMonth, isWeekend, weekendId? }.
 */
export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Start from the Sunday before (or on) the 1st
  const startDate = new Date(year, month, 1 - startDow);

  const grid = [];
  const current = new Date(startDate);

  for (let row = 0; row < 6; row++) {
    const week = [];
    for (let col = 0; col < 7; col++) {
      const d = new Date(current);
      const dow = d.getDay();
      week.push({
        date: d,
        day: d.getDate(),
        inMonth: d.getMonth() === month,
        isWeekend: dow === 0 || dow === 5 || dow === 6, // Fri, Sat, Sun
        isSaturday: dow === 6,
      });
      current.setDate(current.getDate() + 1);
    }
    grid.push(week);
  }

  return grid;
}

/**
 * Given a date, find its weekend ID (the Saturday of that weekend).
 * Friday → next day's Saturday. Saturday → itself. Sunday → previous day's Saturday.
 */
export function getWeekendIdForDate(date) {
  const dow = date.getDay();
  const d = new Date(date);

  if (dow === 5) {
    // Friday → Saturday is next day
    d.setDate(d.getDate() + 1);
  } else if (dow === 0) {
    // Sunday → Saturday was yesterday
    d.setDate(d.getDate() - 1);
  }
  // dow === 6 → Saturday itself

  // Only return weekend ID for Fri/Sat/Sun
  if (dow !== 5 && dow !== 6 && dow !== 0) return null;

  return formatId(d);
}

function formatId(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Get month label from year/month.
 */
export function getMonthLabel(year, month) {
  return new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}
