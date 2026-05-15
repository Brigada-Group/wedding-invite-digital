import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import EnvelopeScene from './components/EnvelopeScene'
import Invitation from './components/Invitation'
import { FAMILIES } from './families'

function App() {
  const [opened, setOpened] = useState(false)

  const family = useMemo(() => {
    const hash = window.location.hash.slice(1).toLowerCase()
    return FAMILIES[hash] || null
  }, [])

  useEffect(() => {
    if (opened) {
      document.body.classList.add('scrollable')
    }
    return () => document.body.classList.remove('scrollable')
  }, [opened])

  return (
    <>
      <AnimatePresence>
        {!opened && (
          <EnvelopeScene onOpen={() => setOpened(true)} />
        )}
      </AnimatePresence>
      {opened && <Invitation family={family} />}
    </>
  )
}

export default App
