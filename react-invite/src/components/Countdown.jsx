import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Invitation.module.css'

const WEDDING = new Date('2026-07-04T19:00:00+02:00')

function calc() {
  const diff = Math.max(0, WEDDING - new Date())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  }
}

export default function Countdown({ delay = 0 }) {
  const [t, setT] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setT(calc), 1000)
    return () => clearInterval(id)
  }, [])

  const boxes = [
    { value: t.days, label: 'Ditë' },
    { value: String(t.hours).padStart(2, '0'), label: 'Orë' },
    { value: String(t.mins).padStart(2, '0'), label: 'Min' },
    { value: String(t.secs).padStart(2, '0'), label: 'Sek' },
  ]

  return (
    <motion.div
      className={styles.countdown}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
    >
      {boxes.map((b, i) => (
        <div key={b.label} className={styles.countdownBox}>
          <span className={styles.countdownNum}>{b.value}</span>
          <span className={styles.countdownLabel}>{b.label}</span>
        </div>
      ))}
    </motion.div>
  )
}
