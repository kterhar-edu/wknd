import Icon from './icons/Icon';
import './TagToggle.css';

const TAG_CONFIG = {
  travelling: { offIcon: 'house', onIcon: 'airplane', label: 'Travelling' },
  celebration: { offIcon: 'calendar', onIcon: 'party', label: 'Celebration' },
  holiday: { offIcon: 'briefcase', onIcon: 'flag', label: 'Holiday' },
};

export default function TagToggle({ tag, active, onToggle }) {
  const config = TAG_CONFIG[tag];
  if (!config) return null;

  return (
    <button
      className={`tag-toggle ${active ? 'tag-toggle--active' : ''}`}
      onClick={() => onToggle(tag)}
      aria-label={`${config.label}: ${active ? 'on' : 'off'}`}
      title={config.label}
    >
      <Icon name={active ? config.onIcon : config.offIcon} size={18} />
    </button>
  );
}
