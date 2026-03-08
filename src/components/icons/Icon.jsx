import { SVG_PATHS } from './svgPaths.jsx';

export default function Icon({ name, size = 24, className = '', ...props }) {
  const paths = SVG_PATHS[name];
  if (!paths) return null;

  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths}
    </svg>
  );
}
