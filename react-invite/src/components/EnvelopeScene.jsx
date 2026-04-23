import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './EnvelopeScene.module.css'

export default function EnvelopeScene({ onOpen }) {
  const [phase, setPhase] = useState('idle') // idle → flap → exit

  function handleClick() {
    if (phase !== 'idle') return
    setPhase('flap')
    setTimeout(() => setPhase('exit'), 500)
    setTimeout(() => onOpen(), 1100)
  }

  return (
    <motion.div
      className={styles.scene}
      onClick={handleClick}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <img src="/frame_top.png" alt="" className={styles.frameTop} />
      <img src="/frame_bottom.png" alt="" className={styles.frameBottom} />

      <motion.div
        className={styles.wrapper}
        animate={
          phase === 'exit'
            ? { rotateX: 12, scale: 0.9, y: 30, opacity: 0 }
            : { rotateX: 0, scale: 1, y: 0, opacity: 1 }
        }
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ perspective: 800 }}
      >
        <div className={styles.interior} />
        <img src="/bottom.png" alt="" className={styles.bottom} />

        <motion.div
          className={styles.flap}
          animate={{ rotateX: phase !== 'idle' ? -180 : 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}
        >
          <img src="/top.png" alt="" className={styles.flapImg} />
        </motion.div>

        <motion.span
          className={styles.prompt}
          animate={{ opacity: phase !== 'idle' ? 0 : [0.3, 0.7, 0.3] }}
          transition={
            phase !== 'idle'
              ? { duration: 0.3 }
              : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          Prekni për të hapur ftesën
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
