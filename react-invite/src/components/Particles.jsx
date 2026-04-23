import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function Particles() {
  const count = typeof window !== 'undefined' && window.innerWidth < 600 ? 15 : 25

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 2 + Math.random() * 5,
      x: Math.random() * 100,
      drift: (Math.random() - 0.5) * 30,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.35,
    })), [count])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99, overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            bottom: -10,
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--pink-light)',
          }}
          animate={{
            y: [0, -window.innerHeight],
            x: [0, p.drift],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
