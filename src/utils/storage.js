/**
 * Thin storage module — swap this file to change backends.
 *
 * localStorage (current):
 *   - persists in browser, device-specific
 *   - ~5MB limit (plenty for this app)
 *
 * To migrate to IndexedDB: make load/save async and update the
 * provider's useEffect + initial state accordingly.
 *
 * To migrate to cloud (Firebase/Supabase): swap load/save for
 * the SDK's get/set calls and add auth. The rest of the app stays
 * the same.
 */

const KEY = 'wknd-data';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
