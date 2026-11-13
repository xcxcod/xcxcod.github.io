export function HeroRover() {
  return (
    <div className="hero-rover" aria-hidden="true">
      <div className="hero-rover-travel">
        <svg className="hero-rover-body" viewBox="0 0 112 54" fill="none">
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M25 33 19 44m34-11-5 11m14-11 14 11" />
            <path d="M20 25h46l10 8-5 6H21l-6-8z" fill="var(--editorial-paper)" />
            <path d="M26 30h21m-17 4h11M33 25l-7-12m-4 1 10-4M57 25V12" />
            <g className="hero-rover-eye">
              <rect x="51" y="5" width="21" height="10" rx="2" fill="var(--editorial-paper)" />
              <circle className="hero-rover-lens" cx="64" cy="10" r="2" fill="currentColor" stroke="none" />
            </g>
            <g className="hero-rover-arm">
              <path d="m73 32 12-12 14 8m0 0 3 6m-3-6 6 1" />
              <circle cx="85" cy="20" r="2" fill="var(--editorial-paper)" />
            </g>
            {[19, 48, 76].map((x) => (
              <g key={x} className="hero-rover-wheel">
                <circle cx={x} cy="45" r="7" fill="var(--editorial-paper)" />
                <path d={`M${x - 4} 45h8m-4-4v8`} />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
