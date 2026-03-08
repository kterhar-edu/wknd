import { useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './icons/Icon';
import './AddEventModal.css';

const DAY_OPTIONS = [
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const COLORS = ['#4A90D9', '#D94A90', '#4AD94A', '#D9A04A', '#904AD9', '#D94A4A'];

export default function AddEventModal({ weekendId, initialEvent, onSave, onDelete, onClose }) {
  const isEditing = !!initialEvent;

  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [startDay, setStartDay] = useState(initialEvent?.startDay ?? 'saturday');
  const [endDay, setEndDay] = useState(initialEvent?.endDay ?? 'saturday');
  const [startTime, setStartTime] = useState(initialEvent?.startTime ?? '');
  const [endTime, setEndTime] = useState(initialEvent?.endTime ?? '');
  const [color, setColor] = useState(
    initialEvent?.color ?? COLORS[Math.floor(Math.random() * COLORS.length)]
  );

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initialEvent?.id ?? `e-${Date.now()}`,
      title: title.trim(),
      startDay,
      endDay,
      startTime: startTime || null,
      endTime: endTime || null,
      color,
    });
    onClose();
  };

  return createPortal(
    <div className="add-event-overlay" onClick={onClose}>
      <div className="add-event-modal" onClick={e => e.stopPropagation()}>
        <div className="add-event-modal__header">
          <h3 className="add-event-modal__title">
            {isEditing ? 'Edit Event' : 'New Event'}
          </h3>
          <div className="add-event-modal__header-actions">
            {isEditing && (
              <button
                className="add-event-modal__delete-btn"
                onClick={onDelete}
                aria-label="Delete event"
              >
                <Icon name="trash" size={18} />
              </button>
            )}
            <button className="add-event-modal__close" onClick={onClose}>
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        <div className="add-event-modal__form">
          <div className="add-event-modal__field">
            <label className="add-event-modal__label">Title</label>
            <input
              className="add-event-modal__input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What's happening?"
              autoFocus
            />
          </div>

          <div className="add-event-modal__row">
            <div className="add-event-modal__field add-event-modal__field--half">
              <label className="add-event-modal__label">Start</label>
              <select
                className="add-event-modal__select"
                value={startDay}
                onChange={e => {
                  setStartDay(e.target.value);
                  const dayOrder = { friday: 0, saturday: 1, sunday: 2 };
                  if (dayOrder[e.target.value] > dayOrder[endDay]) {
                    setEndDay(e.target.value);
                  }
                }}
              >
                {DAY_OPTIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="add-event-modal__field add-event-modal__field--half">
              <label className="add-event-modal__label">End</label>
              <select
                className="add-event-modal__select"
                value={endDay}
                onChange={e => setEndDay(e.target.value)}
              >
                {DAY_OPTIONS.filter(d => {
                  const dayOrder = { friday: 0, saturday: 1, sunday: 2 };
                  return dayOrder[d.value] >= dayOrder[startDay];
                }).map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="add-event-modal__row">
            <div className="add-event-modal__field add-event-modal__field--half">
              <label className="add-event-modal__label">
                Start Time <span className="add-event-modal__optional">(optional)</span>
              </label>
              <input
                className="add-event-modal__input"
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div className="add-event-modal__field add-event-modal__field--half">
              <label className="add-event-modal__label">
                End Time <span className="add-event-modal__optional">(optional)</span>
              </label>
              <input
                className="add-event-modal__input"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="add-event-modal__field">
            <label className="add-event-modal__label">Color</label>
            <div className="add-event-modal__colors">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`add-event-modal__color-btn ${color === c ? 'add-event-modal__color-btn--active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          className="add-event-modal__save"
          onClick={handleSave}
          disabled={!title.trim()}
        >
          {isEditing ? 'Update Event' : 'Add Event'}
        </button>
      </div>
    </div>,
    document.body
  );
}
