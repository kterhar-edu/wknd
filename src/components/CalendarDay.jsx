import './CalendarDay.css';

export default function CalendarDay({ cell, weekendData, onTap }) {
  if (!cell.inMonth) {
    return <div className="calendar-day calendar-day--outside" />;
  }

  const hasEvents = weekendData && weekendData.events.length > 0;
  const isTravelling = weekendData && weekendData.tags.travelling;

  const classes = [
    'calendar-day',
    cell.isWeekend && 'calendar-day--weekend',
    cell.isSaturday && 'calendar-day--saturday',
    hasEvents && 'calendar-day--has-events',
    isTravelling && 'calendar-day--travelling',
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (cell.isWeekend && onTap) onTap();
  };

  return (
    <div className={classes} onClick={handleClick}>
      <span className="calendar-day__num">{cell.day}</span>
      {hasEvents && <span className="calendar-day__dot" />}
    </div>
  );
}
