import { useMemo } from 'react';

export default function ParticleBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 15,
      color: ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b'][Math.floor(Math.random() * 4)],
    })), []
  );

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
      {/* Ambient blobs */}
      <div
        className="absolute rounded-full opacity-10 blur-3xl"
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, #0ea5e9, transparent)',
        }}
      />
      <div
        className="absolute rounded-full opacity-10 blur-3xl"
        style={{
          width: 500,
          height: 500,
          bottom: '-10%',
          right: '-5%',
          background: 'radial-gradient(circle, #8b5cf6, transparent)',
        }}
      />
    </div>
  );
}
