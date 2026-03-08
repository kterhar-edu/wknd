import { createContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { loadAllWeekends, saveWeekend } from '../lib/db';

const DEFAULT_TAGS = { travelling: false, holiday: false };

function createEmptyWeekendData(weekendId) {
  return {
    weekendId,
    events: [],
    tags: { ...DEFAULT_TAGS },
    participants: [],
  };
}

function reducer(state, action) {
  switch (action.type) {

    case 'LOAD_DATA':
      return { ...state, data: action.data, isLoading: false };

    case 'TOGGLE_TAG': {
      const { weekendId, tag } = action;
      const wd = state.data[weekendId] || createEmptyWeekendData(weekendId);
      return {
        ...state,
        data: {
          ...state.data,
          [weekendId]: { ...wd, tags: { ...wd.tags, [tag]: !wd.tags[tag] } },
        },
      };
    }

    case 'ADD_EVENT': {
      const { weekendId, event } = action;
      const wd = state.data[weekendId] || createEmptyWeekendData(weekendId);
      if (wd.events.some(e => e.id === event.id)) return state;
      return {
        ...state,
        data: {
          ...state.data,
          [weekendId]: { ...wd, events: [...wd.events, event] },
        },
      };
    }

    case 'UPDATE_EVENT': {
      const { weekendId, eventId, updates } = action;
      const wd = state.data[weekendId];
      if (!wd) return state;
      return {
        ...state,
        data: {
          ...state.data,
          [weekendId]: {
            ...wd,
            events: wd.events.map(e => e.id === eventId ? { ...e, ...updates } : e),
          },
        },
      };
    }

    case 'DELETE_EVENT': {
      const { weekendId, eventId } = action;
      const wd = state.data[weekendId];
      if (!wd) return state;
      return {
        ...state,
        data: {
          ...state.data,
          [weekendId]: { ...wd, events: wd.events.filter(e => e.id !== eventId) },
        },
      };
    }

    case 'ADD_PARTICIPANT': {
      const { weekendId, participant } = action;
      const wd = state.data[weekendId] || createEmptyWeekendData(weekendId);
      if (wd.participants.some(p => p.id === participant.id)) return state;
      return {
        ...state,
        data: {
          ...state.data,
          [weekendId]: { ...wd, participants: [...wd.participants, participant] },
        },
      };
    }

    case 'REMOVE_PARTICIPANT': {
      const { weekendId, participantId } = action;
      const wd = state.data[weekendId];
      if (!wd) return state;
      return {
        ...state,
        data: {
          ...state.data,
          [weekendId]: {
            ...wd,
            participants: wd.participants.filter(p => p.id !== participantId),
          },
        },
      };
    }

    case 'SEED_WEEKEND': {
      const { weekendId, events, participants } = action;
      const wd = state.data[weekendId] || createEmptyWeekendData(weekendId);
      return {
        ...state,
        data: {
          ...state.data,
          [weekendId]: { ...wd, events, participants },
        },
      };
    }

    case 'SET_FILTER': {
      const { filter, value } = action;
      return { ...state, filters: { ...state.filters, [filter]: value } };
    }

    case 'CLEAR_FILTERS':
      return { ...state, filters: { planFilter: null } };

    case 'SET_VIEW':
      return { ...state, view: action.view };

    default:
      return state;
  }
}

const initialState = {
  data: {},
  filters: { planFilter: null },
  view: 'slider',
  isLoading: true,
};

export const WeekendDataContext = createContext(null);
export const WeekendDispatchContext = createContext(null);

export function WeekendDataProvider({ user, children }) {
  const [state, rawDispatch] = useReducer(reducer, initialState);

  // Refs so interval callbacks always see current values
  const stateRef = useRef(state);
  stateRef.current = state;
  const dirtyRef = useRef(new Set()); // weekendIds changed since last flush

  // ── Load user's data from Supabase on mount ──────────────────────────────
  useEffect(() => {
    loadAllWeekends()
      .then(data => rawDispatch({ type: 'LOAD_DATA', data }))
      .catch(err => {
        console.error('Failed to load weekend data:', err);
        rawDispatch({ type: 'LOAD_DATA', data: {} });
      });
  }, [user.id]);

  // ── Wrapped dispatch: tracks which weekends are dirty ────────────────────
  const dispatch = useCallback((action) => {
    rawDispatch(action);
    if (action.weekendId) dirtyRef.current.add(action.weekendId);
  }, []);

  // ── Flush dirty weekends to Supabase every 1.5 s ────────────────────────
  useEffect(() => {
    const flush = () => {
      const ids = [...dirtyRef.current];
      if (!ids.length) return;
      dirtyRef.current.clear();
      ids.forEach(weekendId => {
        const wd = stateRef.current.data[weekendId];
        if (wd) saveWeekend(user.id, weekendId, wd).catch(console.error);
      });
    };

    const intervalId = setInterval(flush, 1500);
    window.addEventListener('beforeunload', flush);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', flush);
      flush(); // flush on unmount too
    };
  }, [user.id]);

  return (
    <WeekendDataContext.Provider value={state}>
      <WeekendDispatchContext.Provider value={dispatch}>
        {children}
      </WeekendDispatchContext.Provider>
    </WeekendDataContext.Provider>
  );
}
