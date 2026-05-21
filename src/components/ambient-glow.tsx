const glows = [
  "ambient-glow-one",
  "ambient-glow-two",
  "ambient-glow-three",
  "ambient-glow-four",
  "ambient-glow-five",
  "ambient-glow-six",
];

export function AmbientGlow({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`ambient-glow ${className}`}>
      <span className="ambient-glow-canvas" />
      {/* The spans are decorative only; CSS turns each one into a blurred animated light layer. */}
      {glows.map((glow) => (
        <span key={glow} className={`ambient-glow-orb ${glow}`} />
      ))}
      <span className="ambient-glow-radial" />
      <span className="ambient-glow-fade ambient-glow-fade-left" />
      <span className="ambient-glow-fade ambient-glow-fade-right" />
    </div>
  );
}
