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

export function generateWeekends(pastCount = 10, futureCount = 20) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat

  // Find this Saturday
  const thisSaturday = new Date(today);
  if (dayOfWeek === 0) {
    thisSaturday.setDate(today.getDate() - 1);
  } else if (dayOfWeek !== 6) {
    thisSaturday.setDate(today.getDate() + (6 - dayOfWeek));
  }
  thisSaturday.setHours(0, 0, 0, 0);

  const weekends = [];

  for (let i = -pastCount; i <= futureCount; i++) {
    const saturday = new Date(thisSaturday);
    saturday.setDate(thisSaturday.getDate() + i * 7);

    const friday = new Date(saturday);
    friday.setDate(saturday.getDate() - 1);

    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    weekends.push({
      id: formatISO(saturday),
      friday: new Date(friday),
      saturday: new Date(saturday),
      sunday: new Date(sunday),
      label: getLabel(i),
      dateRange: formatRange(friday, sunday),
      monthYear: formatMonthYear(saturday),
      isThisWeekend: i === 0,
      isPast: i < 0,
      offsetIndex: i,
    });
  }

  return { weekends, initialIndex: pastCount };
}
