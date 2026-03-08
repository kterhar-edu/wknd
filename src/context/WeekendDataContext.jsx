import { createContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';

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
    case 'INIT_DATA': {
      const data = { ...state.data };
      action.weekendIds.forEach(id => {
        if (!data[id]) data[id] = createEmptyWeekendData(id);
      });
      return { ...state, data };
    }

    case 'TOGGLE_TAG': {
      const { weekendId, tag } = action;
      const wd = state.data[weekendId] || createEmptyWeekendData(weekendId);
      return {
        ...state,
        data: {
          ...state.data,
          [weekendId]: {
            ...wd,
            tags: { ...wd.tags, [tag]: !wd.tags[tag] },
          },
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
          [weekendId]: {
            ...wd,
            events: wd.events.filter(e => e.id !== eventId),
          },
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
      return {
        ...state,
        filters: { ...state.filters, [filter]: value },
      };
    }

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: { planFilter: null },
      };

    case 'SET_VIEW':
      return { ...state, view: action.view };

    default:
      return state;
  }
}

// Hydrate data from localStorage on startup (filters/view are always transient)
const initialState = {
  data: loadState() ?? {},
  filters: { planFilter: null },
  view: 'slider',
};

export const WeekendDataContext = createContext(null);
export const WeekendDispatchContext = createContext(null);

export function WeekendDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist data to localStorage on every change
  useEffect(() => {
    saveState(state.data);
  }, [state.data]);

  return (
    <WeekendDataContext.Provider value={state}>
      <WeekendDispatchContext.Provider value={dispatch}>
        {children}
      </WeekendDispatchContext.Provider>
    </WeekendDataContext.Provider>
  );
}
