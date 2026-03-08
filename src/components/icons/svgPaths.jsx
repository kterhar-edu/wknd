// Lucide-style SVG paths (24x24 viewBox, stroke-based)
// Each entry is JSX elements for the icon's paths

export const SVG_PATHS = {
  // Tags: Travelling
  house: (
    <>
      <path d="M3 10.182V22h18V10.182L12 2z" />
      <rect x="9" y="14" width="6" height="8" />
    </>
  ),
  airplane: (
    <>
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L11 12l-2 3H6l-2 1.5L7 18l1.5-1v-3l3-2 3.3 7.3c.2.4.7.6 1.1.4l.5-.3c.4-.2.5-.7.4-1.2z" />
    </>
  ),

  // Tags: Celebration
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  party: (
    <>
      <path d="M5.8 11.3L2 22l10.7-3.8" />
      <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <path d="M10 4.04a3 3 0 0 1 2.13 2.13" />
      <path d="M14.12 4a3 3 0 0 1 1.88 1.88" />
    </>
  ),

  // Tags: Holiday
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
      <path d="M2 13h20" />
    </>
  ),
  flag: (
    <>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </>
  ),

  // Navigation / UI
  cards: (
    <>
      <rect x="5" y="2" width="14" height="16" rx="2" />
      <rect x="3" y="5" width="14" height="16" rx="2" opacity="0.5" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  close: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  chevronLeft: (
    <polyline points="15 18 9 12 15 6" />
  ),
  chevronRight: (
    <polyline points="9 18 15 12 9 6" />
  ),
};
