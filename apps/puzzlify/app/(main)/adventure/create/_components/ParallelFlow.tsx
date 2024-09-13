export default function ParallelFlow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 70 95"
      className="fill-background stroke-foreground"
    >
      {/* Start circle */}
      <circle cx="35" cy="10" r="5" strokeWidth="2" className="fill-primary" />

      {/* Connecting lines from start */}
      <line x1="31" y1="13" x2="13" y2="32" strokeWidth="2" />
      <line x1="35" y1="15" x2="35" y2="35" strokeWidth="2" />
      <line x1="39" y1="13" x2="57" y2="32" strokeWidth="2" />

      {/* Three middle circles */}
      <circle cx="10" cy="35" r="5" strokeWidth="2" />
      <circle cx="35" cy="35" r="5" strokeWidth="2" />
      <circle cx="60" cy="35" r="5" strokeWidth="2" />

      {/* Connecting lines between middle circles */}
      <line x1="10" y1="40" x2="10" y2="60" strokeWidth="2" />
      <line x1="35" y1="40" x2="35" y2="60" strokeWidth="2" />
      <line x1="60" y1="40" x2="60" y2="60" strokeWidth="2" />

      {/* Three end circles */}
      <circle cx="10" cy="60" r="5" strokeWidth="2" />
      <circle cx="35" cy="60" r="5" strokeWidth="2" />
      <circle cx="60" cy="60" r="5" strokeWidth="2" />

      {/* Connecting lines to the final node */}
      <line x1="13" y1="64" x2="31" y2="85" strokeWidth="2" />
      <line x1="35" y1="65" x2="35" y2="85" strokeWidth="2" />
      <line x1="57" y1="64" x2="39" y2="85" strokeWidth="2" />

      {/* End circle */}
      <circle cx="35" cy="85" r="5" strokeWidth="2" className="fill-primary" />
    </svg>
  );
}
