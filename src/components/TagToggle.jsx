import Icon from './icons/Icon';
import './TagToggle.css';

const TAG_CONFIG = {
  travelling: {
    icon: 'airplane',
    label: 'Travelling',
    activeColor: '#4A90D9',
    activeBg: 'rgba(74,144,217,0.18)',
  },
  holiday: {
    icon: 'flag',
    label: 'Holiday',
    activeColor: '#D9A04A',
    activeBg: 'rgba(217,160,74,0.18)',
  },
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
      style={active ? { backgroundColor: config.activeBg, color: config.activeColor } : {}}
    >
      <Icon name={config.icon} size={18} />
    </button>
  );
}
