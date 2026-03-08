import { useState, useMemo } from 'react';
import { useWeekendState } from '../context/useWeekendData';
import { getMonthGrid, getWeekendIdForDate, getMonthLabel } from '../utils/calendarHelpers';
import CalendarDay from './CalendarDay';
import Icon from './icons/Icon';
import './CalendarView.css';

const DOW_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ weekends, onNavigateToWeekend }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const state = useWeekendState();

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const label = getMonthLabel(year, month);

  // Build a lookup: weekendId → index in weekends array
  const weekendIndexMap = useMemo(() => {
    const map = {};
    weekends.forEach((w, i) => { map[w.id] = i; });
    return map;
  }, [weekends]);

  const prevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  const goToToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  return (
    <div className="calendar-view">
      <div className="calendar-view__nav">
        <button className="calendar-view__nav-btn" onClick={prevMonth}>
          <Icon name="chevronLeft" size={18} />
        </button>
        <button className="calendar-view__month-label" onClick={goToToday}>
          {label}
        </button>
        <button className="calendar-view__nav-btn" onClick={nextMonth}>
          <Icon name="chevronRight" size={18} />
        </button>
      </div>

      <div className="calendar-view__grid">
        {DOW_HEADERS.map(d => (
          <div key={d} className="calendar-view__dow">{d}</div>
        ))}

        {grid.flat().map((cell, i) => {
          const weekendId = cell.isWeekend ? getWeekendIdForDate(cell.date) : null;
          const weekendData = weekendId ? state.data[weekendId] : null;
          const weekendIdx = weekendId != null ? weekendIndexMap[weekendId] : undefined;

          return (
            <CalendarDay
              key={i}
              cell={cell}
              weekendData={weekendData}
              onTap={weekendIdx != null ? () => onNavigateToWeekend(weekendIdx) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
