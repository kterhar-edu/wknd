import { useWeekendTags, useDispatch } from '../context/useWeekendData';
import TagToggle from './TagToggle';
import './TagBar.css';

const TAGS = ['travelling', 'holiday'];

export default function TagBar({ weekendId }) {
  const tags = useWeekendTags(weekendId);
  const dispatch = useDispatch();

  const handleToggle = (tag) => {
    dispatch({ type: 'TOGGLE_TAG', weekendId, tag });
  };

  return (
    <div className="tag-bar">
      {TAGS.map(tag => (
        <TagToggle
          key={tag}
          tag={tag}
          active={tags[tag]}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
