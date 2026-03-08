import { useFilters, useDispatch } from '../context/useWeekendData';
import Icon from './icons/Icon';
import './FilterBar.css';

const FILTERS = [
  { key: 'noPlans', label: 'No Plans', icon: 'calendar' },
  { key: 'travelling', label: 'Travelling', icon: 'airplane', isTag: true },
  { key: 'celebration', label: 'Celebration', icon: 'party', isTag: true },
  { key: 'holiday', label: 'Holiday', icon: 'flag', isTag: true },
];

export default function FilterBar() {
  const filters = useFilters();
  const dispatch = useDispatch();

  const handleTap = (filter) => {
    if (filter.isTag) {
      // Tag filters are radio — toggle off if already active, else switch
      const newTag = filters.tag === filter.key ? null : filter.key;
      dispatch({ type: 'SET_FILTER', filter: 'tag', value: newTag });
    } else {
      // "No Plans" is a boolean toggle
      dispatch({ type: 'SET_FILTER', filter: filter.key, value: !filters[filter.key] });
    }
  };

  const isActive = (filter) => {
    if (filter.isTag) return filters.tag === filter.key;
    return filters[filter.key];
  };

  const hasAnyFilter = filters.noPlans || filters.tag !== null;

  return (
    <div className="filter-bar">
      {FILTERS.map(f => (
        <button
          key={f.key}
          className={`filter-bar__pill ${isActive(f) ? 'filter-bar__pill--active' : ''}`}
          onClick={() => handleTap(f)}
        >
          <Icon name={f.icon} size={14} />
          <span>{f.label}</span>
        </button>
      ))}
      {hasAnyFilter && (
        <button
          className="filter-bar__pill filter-bar__pill--clear"
          onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
