import { useFilters, useDispatch } from '../context/useWeekendData';
import Icon from './icons/Icon';
import './FilterBar.css';

const FILTERS = [
  { value: 'noPlans', label: 'No Plans', icon: 'calendar' },
  { value: 'hasPlans', label: 'Plans', icon: 'cards' },
];

export default function FilterBar() {
  const filters = useFilters();
  const dispatch = useDispatch();

  const handleTap = (filterValue) => {
    // radio-style: tap active → deselect, tap inactive → switch
    const newValue = filters.planFilter === filterValue ? null : filterValue;
    dispatch({ type: 'SET_FILTER', filter: 'planFilter', value: newValue });
  };

  const hasAnyFilter = filters.planFilter !== null;

  return (
    <div className="filter-bar">
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={`filter-bar__pill ${filters.planFilter === f.value ? 'filter-bar__pill--active' : ''}`}
          onClick={() => handleTap(f.value)}
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
