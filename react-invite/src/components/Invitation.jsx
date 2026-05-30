import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Particles from './Particles'
import Countdown from './Countdown'
import styles from './Invitation.module.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] },
})

function RevealSection({ children, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}

function downloadICS() {
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding//Loti&Matina//SQ',
    'BEGIN:VEVENT', 'DTSTART:20260704T170000Z', 'DTEND:20260705T000000Z',
    'SUMMARY:Dasma e Loti & Matina',
    'DESCRIPTION:Jeni të ftuar të festoni dasmën e Loti & Matina Gashi',
    'LOCATION:Hills Restaurant\\, Ferizaj\\, Kosovë',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'dasma-loti-matina.ics'
  a.click()
  URL.revokeObjectURL(url)
}

function sendRSVP() {
  const msg = encodeURIComponent('Përshëndetje! Do të marrim pjesë në dasmën tuaj me gëzim! 🎉')
  window.open(`https://wa.me/38344434679?text=${msg}`, '_blank')
}

function declineRSVP() {
  const msg = encodeURIComponent('Përshëndetje! Ju falënderojmë për ftesën, por fatkeqësisht nuk do të mund të marrim pjesë. Ju urojmë gjithë të mirat! 💐')
  window.open(`https://wa.me/38344434679?text=${msg}`, '_blank')
}

export default function Invitation({ family }) {
  const heroVideoRef = useRef(null)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    const playWhenReady = () => {
      video.play().catch(() => {
        video.classList.add(styles.heroVideoHidden)
      })
    }
    if (video.readyState >= 2) playWhenReady()
    else video.addEventListener('canplay', playWhenReady, { once: true })
    return () => video.removeEventListener('canplay', playWhenReady)
  }, [])

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Particles />

      {/* Corner flourishes */}
      {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(pos => (
        <motion.div
          key={pos}
          className={`${styles.corner} ${styles[pos]}`}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3 }}
        />
      ))}

      <div className={styles.content}>
        {/* Hero photo — still image fades into animated intro */}
        <motion.div className={styles.heroPhoto} {...fadeUp(0.1)}>
          <img src="/main.png" alt="Loti & Matina" className={styles.heroImg} />
          <video
            ref={heroVideoRef}
            className={styles.heroVideo}
            src="/main-intro.mp4"
            poster="/main.png"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className={styles.topLine}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 36, opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />

        {/* Monogram */}
        <motion.div
          className={styles.monogram}
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span>L&M</span>
        </motion.div>

        {/* Family greeting */}
        <motion.div className={styles.familyGreeting} {...fadeUp(0.9)}>
          <span className={styles.label}>Jeni të ftuar me nderim</span>
          {family?.members?.length > 0 && (
            <ul className={styles.familyMembers}>
              {family.members.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          )}
          <span className={styles.invitedText}>të festoni dasmën e</span>
        </motion.div>

        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />

        {/* Couple names */}
        <motion.div className={styles.coupleSection} {...fadeUp(1.4)}>
          <div className={styles.coupleName}>
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.5, ease: [0.23, 1, 0.32, 1] }}
            >
              Loti
            </motion.span>
            <motion.span
              className={styles.ampersand}
              initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              &
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.7, ease: [0.23, 1, 0.32, 1] }}
            >
              Matina
            </motion.span>
          </div>
        </motion.div>

        {/* Countdown */}
        <Countdown delay={1.8} />

        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 2 }}
        />

        {/* Details */}
        <motion.div className={styles.details} {...fadeUp(2.2)}>
          {[
            { label: 'Data', value: 'E Shtunë, 4 Korrik 2026' },
            { label: 'Ora', value: '19:00' },
            { label: 'Vendi', value: 'Hills Restaurant', sub: 'Ferizaj, Kosovë' },
          ].map((d, i) => (
            <motion.div
              key={d.label}
              className={styles.detailRow}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 2.2 + i * 0.2 }}
            >
              <div className={styles.detailLabel}>{d.label}</div>
              <div className={styles.detailValue}>{d.value}</div>
              {d.sub && <div className={styles.detailSub}>{d.sub}</div>}
            </motion.div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <RevealSection className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={sendRSVP}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.503 3.935 1.389 5.611L0 24l6.597-1.332A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.855 0-3.63-.5-5.181-1.441l-.372-.22-3.856.777.813-3.741-.242-.385A9.772 9.772 0 012.182 12c0-5.414 4.404-9.818 9.818-9.818S21.818 6.586 21.818 12 17.414 21.818 12 21.818z" />
            </svg>
            Konfirmo Pjesëmarrjen
          </button>
          <button className={`${styles.btn} ${styles.btnDecline}`} onClick={declineRSVP}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Më vjen keq, nuk mundem
          </button>
          <button className={`${styles.btn} ${styles.btnOutline}`} onClick={downloadICS}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Ruaje në Kalendar
          </button>
        </RevealSection>

        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 2.8 }}
        />

        {/* Venue & Map */}
        <RevealSection className={styles.mapSection}>
          <div className={styles.venueImgWrap}>
            <img src="/image.jpeg" alt="Hills Restaurant" className={styles.venueImg} />
            <div className={styles.venueCaption}>Hills Restaurant</div>
          </div>
          <div className={styles.mapWrap}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3481.2168232819986!2d21.106019606503757!3d42.37015864053435!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13547f70a162d831%3A0x15b7d561b690fc41!2sThe%20Hills!5e0!3m2!1sen!2sus!4v1780175124169!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue location"
            />
          </div>
        </RevealSection>

        {/* Footer */}
        <RevealSection className={styles.footer}>
          <p>
            Do të ishim të nderuar me praninë tuaj<br />
            ndërsa fillojmë këtë kapitull të ri së bashku.
          </p>
          <motion.span
            className={styles.hearts}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 3.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            ♥ ♥ ♥
          </motion.span>
        </RevealSection>
      </div>
    </motion.div>
  )
}
