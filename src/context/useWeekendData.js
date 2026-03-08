import { useContext } from 'react';
import { WeekendDataContext, WeekendDispatchContext } from './WeekendDataContext';

const EMPTY_DATA = { events: [], tags: { travelling: false, holiday: false }, participants: [] };

export function useWeekendState() {
  return useContext(WeekendDataContext);
}

export function useDispatch() {
  return useContext(WeekendDispatchContext);
}

export function useWeekendData(weekendId) {
  const state = useContext(WeekendDataContext);
  return state.data[weekendId] || EMPTY_DATA;
}

export function useWeekendTags(weekendId) {
  const data = useWeekendData(weekendId);
  return data.tags;
}

export function useFilters() {
  const state = useContext(WeekendDataContext);
  return state.filters;
}

export function useView() {
  const state = useContext(WeekendDataContext);
  return state.view;
}
