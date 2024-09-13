export default function SingleFlow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 70 95"
      className="fill-background stroke-foreground"
    >
      {/* Start circle */}
      <circle cx="35" cy="10" r="5" strokeWidth="2" className="fill-primary" />

      {/* Connecting line to Middle circle 1 */}
      <line x1="35" y1="15" x2="35" y2="35" strokeWidth="2" />

      {/* Middle circle 1 */}
      <circle cx="35" cy="35" r="5" strokeWidth="2" />

      {/* Connecting line to Middle circle 2 */}
      <line x1="35" y1="40" x2="35" y2="60" strokeWidth="2" />

      {/* Middle circle 2 */}
      <circle cx="35" cy="60" r="5" strokeWidth="2" />

      {/* Connecting line to End circle */}
      <line x1="35" y1="65" x2="35" y2="85" strokeWidth="2" />

      {/* End circle */}
      <circle cx="35" cy="85" r="5" strokeWidth="2" className="fill-primary" />
    </svg>
  );
}
