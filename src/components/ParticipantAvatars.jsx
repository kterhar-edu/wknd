import { useWeekendData } from '../context/useWeekendData';
import './ParticipantAvatars.css';

// Only allow https: and data: image URLs — blocks javascript: and other schemes
const isSafeImageUrl = (url) => {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'data:';
  } catch {
    return false;
  }
};

const MAX_VISIBLE = 4;

export default function ParticipantAvatars({ weekendId }) {
  const { participants } = useWeekendData(weekendId);

  if (participants.length === 0) return null;

  const visible = participants.slice(0, MAX_VISIBLE);
  const overflow = participants.length - MAX_VISIBLE;

  return (
    <div className="participant-avatars">
      {visible.map((p, i) => (
        <div
          key={p.id}
          className="participant-avatars__circle"
          style={{ backgroundColor: p.color, zIndex: MAX_VISIBLE - i }}
          title={p.name}
        >
          {p.avatarUrl && isSafeImageUrl(p.avatarUrl) ? (
            <img src={p.avatarUrl} alt={p.name} className="participant-avatars__img" />
          ) : (
            <span className="participant-avatars__initials">{p.initials}</span>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div className="participant-avatars__circle participant-avatars__overflow" style={{ zIndex: 0 }}>
          <span className="participant-avatars__initials">+{overflow}</span>
        </div>
      )}
    </div>
  );
}
