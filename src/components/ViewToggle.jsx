import { useView, useDispatch } from '../context/useWeekendData';
import Icon from './icons/Icon';
import './ViewToggle.css';

export default function ViewToggle() {
  const view = useView();
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch({ type: 'SET_VIEW', view: view === 'slider' ? 'calendar' : 'slider' });
  };

  return (
    <button className="view-toggle" onClick={toggle} title={view === 'slider' ? 'Calendar view' : 'Card view'}>
      <Icon name={view === 'slider' ? 'grid' : 'cards'} size={18} />
    </button>
  );
}
