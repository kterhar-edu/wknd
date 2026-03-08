function formatISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatRange(friday, sunday) {
  const friMonth = friday.toLocaleString('en-US', { month: 'short' });
  const sunMonth = sunday.toLocaleString('en-US', { month: 'short' });
  const friDay = friday.getDate();
  const sunDay = sunday.getDate();

  if (friMonth === sunMonth) {
    return `${friMonth} ${friDay} - ${sunDay}`;
  }
  return `${friMonth} ${friDay} - ${sunMonth} ${sunDay}`;
}

function formatMonthYear(date) {
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function getLabel(offset) {
  if (offset === 0) return 'This Weekend';
  if (offset === 1) return 'Next Weekend';
  if (offset === -1) return 'Last Weekend';
  if (offset > 1) return `In ${offset} Weekends`;
  return `${Math.abs(offset)} Weekends Ago`;
}

export function generateWeekends() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat

  // Find this Saturday
  const thisSaturday = new Date(today);
  if (dayOfWeek === 0) {
    thisSaturday.setDate(today.getDate() - 1);
  } else if (dayOfWeek !== 6) {
    thisSaturday.setDate(today.getDate() + (6 - dayOfWeek));
  }
  thisSaturday.setHours(0, 0, 0, 0);

  // First Saturday on or after Jan 1, 2026
  const rangeStart = new Date(2026, 0, 1);
  const startDow = rangeStart.getDay();
  const firstSaturday = new Date(rangeStart);
  firstSaturday.setDate(rangeStart.getDate() + ((6 - startDow + 7) % 7));

  // Last Saturday on or before Dec 31, 2028
  const rangeEnd = new Date(2028, 11, 31);
  const endDow = rangeEnd.getDay();
  const lastSaturday = new Date(rangeEnd);
  lastSaturday.setDate(rangeEnd.getDate() - ((endDow - 6 + 7) % 7));

  const weekends = [];
  let initialIndex = 0;
  const cursor = new Date(firstSaturday);

  while (cursor <= lastSaturday) {
    const saturday = new Date(cursor);
    const friday = new Date(saturday);
    friday.setDate(saturday.getDate() - 1);
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    const offsetMs = saturday.getTime() - thisSaturday.getTime();
    const offsetIndex = Math.round(offsetMs / (7 * 24 * 60 * 60 * 1000));

    if (saturday.getTime() === thisSaturday.getTime()) {
      initialIndex = weekends.length;
    }

    weekends.push({
      id: formatISO(saturday),
      friday: new Date(friday),
      saturday: new Date(saturday),
      sunday: new Date(sunday),
      label: getLabel(offsetIndex),
      dateRange: formatRange(friday, sunday),
      monthYear: formatMonthYear(saturday),
      isThisWeekend: offsetIndex === 0,
      isPast: offsetIndex < 0,
      offsetIndex,
    });

    cursor.setDate(cursor.getDate() + 7);
  }

  return { weekends, initialIndex };
}
