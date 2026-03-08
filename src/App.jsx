import { useMemo, useRef, useEffect, useCallback } from 'react';
import { WeekendDataProvider } from './context/WeekendDataContext';
import { useDispatch, useWeekendState, useFilters, useView } from './context/useWeekendData';
import WeekendSlider from './components/WeekendSlider';
import FilterBar from './components/FilterBar';
import CalendarView from './components/CalendarView';
import ViewToggle from './components/ViewToggle';
import { generateWeekends } from './utils/weekends';
import { loadState } from './utils/storage';
import './App.css';

function AppInner() {
  const { weekends, initialIndex } = useMemo(() => generateWeekends(), []);
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const state = useWeekendState();
  const filters = useFilters();
  const view = useView();

  useEffect(() => {
    // Only seed demo data on first run (nothing in localStorage yet)
    const stored = loadState();
    const isFirstRun = !stored || Object.keys(stored).length === 0;
    if (isFirstRun) {
      const thisWeekend = weekends[initialIndex];
      if (thisWeekend) {
        dispatch({
          type: 'SEED_WEEKEND',
          weekendId: thisWeekend.id,
          participants: [
            { id: '1', name: 'Alex Chen', initials: 'AC', color: '#4A90D9' },
            { id: '2', name: 'Sam Lee', initials: 'SL', color: '#D94A90' },
            { id: '3', name: 'Jordan', initials: 'JO', color: '#4AD94A' },
          ],
          events: [
            { id: 'e1', title: 'Dinner out', startDay: 'friday', endDay: 'friday', startTime: '19:00', endTime: null, color: '#D94A90' },
            { id: 'e2', title: 'Hiking', startDay: 'saturday', endDay: 'saturday', startTime: '09:00', endTime: null, color: '#4AD94A' },
            { id: 'e3', title: 'Camping trip', startDay: 'friday', endDay: 'sunday', startTime: null, endTime: null, color: '#D9A04A' },
          ],
        });
      }
    }
  }, [weekends, initialIndex, dispatch]);

  // Apply filters
  const hasAnyFilter = filters.planFilter !== null;

  const filteredWeekends = useMemo(() => {
    if (!hasAnyFilter) return weekends;

    return weekends.filter(w => {
      const wd = state.data[w.id];
      const hasEvents = wd?.events?.length > 0;

      if (filters.planFilter === 'noPlans') return !hasEvents;
      if (filters.planFilter === 'hasPlans') return hasEvents;
      return true;
    });
  }, [weekends, state.data, filters, hasAnyFilter]);

  // Find initial index in filtered list (closest to "This Weekend")
  const filteredInitialIndex = useMemo(() => {
    if (!hasAnyFilter) return initialIndex;
    const thisWeekendId = weekends[initialIndex]?.id;
    const idx = filteredWeekends.findIndex(w => w.id === thisWeekendId);
    if (idx >= 0) return idx;
    // Find closest future weekend in filtered list
    for (let i = 0; i < filteredWeekends.length; i++) {
      if (!filteredWeekends[i].isPast) return i;
    }
    return 0;
  }, [filteredWeekends, weekends, initialIndex, hasAnyFilter]);

  const handleLogoClick = () => {
    if (hasAnyFilter) {
      dispatch({ type: 'CLEAR_FILTERS' });
    }
    if (view === 'calendar') {
      dispatch({ type: 'SET_VIEW', view: 'slider' });
    }
    sliderRef.current?.goToSlide(initialIndex);
  };

  // Calendar taps a weekend → switch to slider and navigate there
  const handleCalendarNavigate = useCallback((weekendIdx) => {
    dispatch({ type: 'SET_VIEW', view: 'slider' });
    // Use a timeout to let slider mount before navigating
    setTimeout(() => {
      sliderRef.current?.goToSlide(weekendIdx);
    }, 100);
  }, [dispatch]);

  return (
    <div className="app">
      <div className="app__header">
        <button className="app__logo" onClick={handleLogoClick}>
          WKND
        </button>
        <ViewToggle />
      </div>
      <FilterBar />
      {view === 'slider' ? (
        filteredWeekends.length > 0 ? (
          <WeekendSlider
            key={hasAnyFilter ? `filtered-${filters.planFilter}` : 'all'}
            ref={sliderRef}
            weekends={filteredWeekends}
            initialIndex={filteredInitialIndex}
          />
        ) : (
          <div className="app__empty">
            <p>No weekends match this filter</p>
            <button
              className="app__empty-clear"
              onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
            >
              Clear Filters
            </button>
          </div>
        )
      ) : (
        <CalendarView
          weekends={weekends}
          onNavigateToWeekend={handleCalendarNavigate}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <WeekendDataProvider>
      <AppInner />
    </WeekendDataProvider>
  );
}

export default App;
