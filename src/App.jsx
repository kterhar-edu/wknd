import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { WeekendDataProvider } from './context/WeekendDataContext';
import { useDispatch, useWeekendState, useFilters, useView } from './context/useWeekendData';
import { supabase } from './lib/supabase';
import WeekendSlider from './components/WeekendSlider';
import FilterBar from './components/FilterBar';
import CalendarView from './components/CalendarView';
import ViewToggle from './components/ViewToggle';
import AuthGate from './components/AuthGate';
import { generateWeekends } from './utils/weekends';
import './App.css';

// ── Inner app — only rendered once authenticated + data loaded ───────────────

function AppInner({ user }) {
  const { weekends, initialIndex } = useMemo(() => generateWeekends(), []);
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const state = useWeekendState();
  const filters = useFilters();
  const view = useView();

  // Seed demo data the very first time a user signs up (empty DB)
  const hasSeededRef = useRef(false);
  useEffect(() => {
    if (state.isLoading) return;
    if (hasSeededRef.current) return;
    hasSeededRef.current = true;

    if (Object.keys(state.data).length === 0) {
      const thisWeekend = weekends[initialIndex];
      if (thisWeekend) {
        dispatch({
          type: 'SEED_WEEKEND',
          weekendId: thisWeekend.id,
          participants: [
            { id: '1', name: 'Alex Chen', initials: 'AC', color: '#4A90D9' },
            { id: '2', name: 'Sam Lee',   initials: 'SL', color: '#D94A90' },
            { id: '3', name: 'Jordan',    initials: 'JO', color: '#4AD94A' },
          ],
          events: [
            { id: 'e1', title: 'Dinner out',  startDay: 'friday',   endDay: 'friday',   startTime: '19:00', endTime: null, color: '#D94A90' },
            { id: 'e2', title: 'Hiking',       startDay: 'saturday', endDay: 'saturday', startTime: '09:00', endTime: null, color: '#4AD94A' },
            { id: 'e3', title: 'Camping trip', startDay: 'friday',   endDay: 'sunday',   startTime: null,    endTime: null, color: '#D9A04A' },
          ],
        });
      }
    }
  }, [state.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply plan filter
  const hasAnyFilter = filters.planFilter !== null;
  const filteredWeekends = useMemo(() => {
    if (!hasAnyFilter) return weekends;
    return weekends.filter(w => {
      const wd = state.data[w.id];
      const hasEvents = wd?.events?.length > 0;
      if (filters.planFilter === 'noPlans')  return !hasEvents;
      if (filters.planFilter === 'hasPlans') return  hasEvents;
      return true;
    });
  }, [weekends, state.data, filters, hasAnyFilter]);

  const filteredInitialIndex = useMemo(() => {
    if (!hasAnyFilter) return initialIndex;
    const thisWeekendId = weekends[initialIndex]?.id;
    const idx = filteredWeekends.findIndex(w => w.id === thisWeekendId);
    if (idx >= 0) return idx;
    for (let i = 0; i < filteredWeekends.length; i++) {
      if (!filteredWeekends[i].isPast) return i;
    }
    return 0;
  }, [filteredWeekends, weekends, initialIndex, hasAnyFilter]);

  const handleLogoClick = () => {
    if (hasAnyFilter) dispatch({ type: 'CLEAR_FILTERS' });
    if (view === 'calendar') dispatch({ type: 'SET_VIEW', view: 'slider' });
    sliderRef.current?.goToSlide(initialIndex);
  };

  const handleCalendarNavigate = useCallback((weekendIdx) => {
    dispatch({ type: 'SET_VIEW', view: 'slider' });
    setTimeout(() => sliderRef.current?.goToSlide(weekendIdx), 100);
  }, [dispatch]);

  // Loading screen while Supabase fetch is in-flight
  if (state.isLoading) {
    return (
      <div className="app app--loading">
        <div className="app__loader">
          <span className="app__loader-logo">wknd</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app__header">
        <button className="app__logo" onClick={handleLogoClick}>WKND</button>
        <div className="app__header-right">
          <ViewToggle />
          <button
            className="app__signout"
            onClick={() => supabase.auth.signOut()}
            title={`Signed in as ${user.email} — tap to sign out`}
          >
            {user.email?.[0]?.toUpperCase() ?? '?'}
          </button>
        </div>
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

// ── Root component — manages Supabase auth session ───────────────────────────

function App() {
  const [session,     setSession]     = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Handles fresh load AND magic-link redirect (token in URL hash)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Return null (blank) while checking for an existing session — avoids flash
  if (authLoading) return null;

  if (!session) return <AuthGate />;

  return (
    <WeekendDataProvider user={session.user}>
      <AppInner user={session.user} />
    </WeekendDataProvider>
  );
}

export default App;
