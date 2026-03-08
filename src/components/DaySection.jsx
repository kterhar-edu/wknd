import EventChip from './EventChip';
import './DaySection.css';

const DAY_ABBREV = { friday: 'FRI', saturday: 'SAT', sunday: 'SUN' };

export default function DaySection({ day, date, events }) {
  const dayNum = date.getDate();
  const monthAbbrev = date.toLocaleString('en-US', { month: 'short' });

  return (
    <div className="day-section">
      <div className="day-section__header">
        <span className="day-section__day">{DAY_ABBREV[day]}</span>
        <span className="day-section__date">{monthAbbrev} {dayNum}</span>
      </div>
      <div className="day-section__events">
        {events.map(event => (
          <EventChip key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
