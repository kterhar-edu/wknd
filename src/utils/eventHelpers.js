export const DAY_ORDER = { friday: 0, saturday: 1, sunday: 2 };
export const DAY_KEYS = ['friday', 'saturday', 'sunday'];

export function eventSpansDay(event, day) {
  const start = DAY_ORDER[event.startDay];
  const end = DAY_ORDER[event.endDay];
  const target = DAY_ORDER[day];
  return target >= start && target <= end;
}

export function isMultiDay(event) {
  return event.startDay !== event.endDay;
}

export function getSpanRows(event) {
  const start = DAY_ORDER[event.startDay] + 1; // CSS grid rows are 1-indexed
  const end = DAY_ORDER[event.endDay] + 2;     // grid-row-end is exclusive
  return { gridRowStart: start, gridRowEnd: end };
}

export function sortEvents(events) {
  return [...events].sort((a, b) => {
    const dayDiff = DAY_ORDER[a.startDay] - DAY_ORDER[b.startDay];
    if (dayDiff !== 0) return dayDiff;
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    if (a.startTime) return -1;
    if (b.startTime) return 1;
    return 0;
  });
}

export function getSingleDayEvents(events, day) {
  return events.filter(e => !isMultiDay(e) && e.startDay === day);
}

export function getMultiDayEvents(events) {
  return events.filter(isMultiDay);
}
