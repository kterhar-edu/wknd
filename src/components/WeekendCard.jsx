import { useState, useRef, useEffect } from 'react';
import { useWeekendData, useDispatch } from '../context/useWeekendData';
import { DAY_KEYS, getSingleDayEvents, getMultiDayEvents, sortEvents } from '../utils/eventHelpers';
import DaySection from './DaySection';
import MultiDayEvent from './MultiDayEvent';
import TagBar from './TagBar';
import ParticipantAvatars from './ParticipantAvatars';
import AddEventModal from './AddEventModal';
import Icon from './icons/Icon';
import './WeekendCard.css';

const CARD_COLORS = [
  { bg: '#E8F4FD', accent: '#4A90D9' },
  { bg: '#FDE8F4', accent: '#D94A90' },
  { bg: '#E8FDE8', accent: '#4AD94A' },
  { bg: '#FDF4E8', accent: '#D9A04A' },
  { bg: '#F4E8FD', accent: '#904AD9' },
  { bg: '#FDE8E8', accent: '#D94A4A' },
];

const DAY_DATES = { friday: 'friday', saturday: 'saturday', sunday: 'sunday' };

export default function WeekendCard({ weekend }) {
  const colorIndex = Math.abs(weekend.offsetIndex) % CARD_COLORS.length;
  const color = CARD_COLORS[colorIndex];
  const weekendData = useWeekendData(weekend.id);
  const dispatch = useDispatch();
  const events = sortEvents(weekendData.events);
  const multiDayEvents = getMultiDayEvents(events);
  const hasAnyEvents = events.length > 0;

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const addBtnRef = useRef(null);
  const daysRef = useRef(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  // Bypass Swiper: native listener on the "+" add button
  const showModalRef = useRef(setShowModal);
  showModalRef.current = setShowModal;

  useEffect(() => {
    const btn = addBtnRef.current;
    if (!btn) return;
    const handler = (e) => { e.stopPropagation(); e.preventDefault(); showModalRef.current(true); };
    btn.addEventListener('pointerdown', (e) => e.stopPropagation(), true);
    btn.addEventListener('click', handler, true);
    return () => { btn.removeEventListener('click', handler, true); };
  }, []);

  // Bypass Swiper: event delegation on days container for chip taps
  const setEditingRef = useRef(setEditingEvent);
  setEditingRef.current = setEditingEvent;

  useEffect(() => {
    const container = daysRef.current;
    if (!container) return;
    const handler = (e) => {
      const chip = e.target.closest('[data-event-id]');
      if (chip) {
        e.stopPropagation();
        e.preventDefault();
        const eventId = chip.dataset.eventId;
        const found = eventsRef.current.find(ev => ev.id === eventId);
        if (found) setEditingRef.current(found);
      }
    };
    container.addEventListener('click', handler, true);
    return () => container.removeEventListener('click', handler, true);
  }, []);

  const handleAddEvent = (event) => {
    dispatch({ type: 'ADD_EVENT', weekendId: weekend.id, event });
  };

  const handleUpdateEvent = (updatedEvent) => {
    dispatch({ type: 'UPDATE_EVENT', weekendId: weekend.id, eventId: editingEvent.id, updates: updatedEvent });
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    dispatch({ type: 'DELETE_EVENT', weekendId: weekend.id, eventId: editingEvent.id });
    setEditingEvent(null);
  };

  const cardClass = [
    'weekend-card',
    weekend.isPast && 'weekend-card--past',
    weekend.isThisWeekend && 'weekend-card--current',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass} style={{ backgroundColor: color.bg }}>
      <div className="weekend-card__header">
        <div className="weekend-card__header-top">
          <div>
            <span className="weekend-card__label">{weekend.label}</span>
            <h2 className="weekend-card__dates">{weekend.dateRange}</h2>
            <span className="weekend-card__year">{weekend.monthYear}</span>
          </div>
          <div className="weekend-card__header-right">
            <ParticipantAvatars weekendId={weekend.id} />
            {weekend.isThisWeekend && (
              <span className="weekend-card__badge" style={{ backgroundColor: color.accent }}>
                This Weekend
              </span>
            )}
          </div>
        </div>
      </div>

      <div ref={daysRef} className="weekend-card__days">
        {multiDayEvents.map(event => (
          <MultiDayEvent key={event.id} event={event} />
        ))}
        {DAY_KEYS.map(day => (
          <div key={day} className="weekend-card__day-row" style={{ gridColumn: 2 }}>
            <DaySection
              day={day}
              date={weekend[DAY_DATES[day]]}
              events={getSingleDayEvents(events, day)}
            />
          </div>
        ))}
        {!hasAnyEvents && (
          <div className="weekend-card__empty">No plans yet</div>
        )}
        <button
          ref={addBtnRef}
          className="weekend-card__add-btn"
          style={{ color: color.accent }}
        >
          <Icon name="plus" size={16} />
        </button>
      </div>

      <div className="weekend-card__footer">
        <TagBar weekendId={weekend.id} />
      </div>

      {showModal && (
        <AddEventModal
          weekendId={weekend.id}
          onSave={handleAddEvent}
          onClose={() => setShowModal(false)}
        />
      )}

      {editingEvent && (
        <AddEventModal
          weekendId={weekend.id}
          initialEvent={editingEvent}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}
