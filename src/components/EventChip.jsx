import './EventChip.css';

const DEFAULT_COLORS = ['#4A90D9', '#D94A90', '#4AD94A', '#D9A04A', '#904AD9', '#D94A4A'];

export default function EventChip({ event }) {
  const color = event.color || DEFAULT_COLORS[event.title.length % DEFAULT_COLORS.length];

  return (
    <div
      className="event-chip"
      data-event-id={event.id}
      style={{ backgroundColor: color + '22', borderLeft: `3px solid ${color}` }}
    >
      <span className="event-chip__title">{event.title}</span>
      {event.startTime && (
        <span className="event-chip__time">{event.startTime}</span>
      )}
    </div>
  );
}
