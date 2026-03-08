import { getSpanRows } from '../utils/eventHelpers';
import './MultiDayEvent.css';

const DEFAULT_COLORS = ['#4A90D9', '#D94A90', '#4AD94A', '#D9A04A', '#904AD9'];

export default function MultiDayEvent({ event }) {
  const { gridRowStart, gridRowEnd } = getSpanRows(event);
  const color = event.color || DEFAULT_COLORS[event.title.length % DEFAULT_COLORS.length];

  return (
    <div
      className="multi-day-event"
      style={{
        gridRowStart,
        gridRowEnd,
        gridColumn: 1,
        backgroundColor: color + '33',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <span className="multi-day-event__title">{event.title}</span>
    </div>
  );
}
