import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import EnvelopeScene from './components/EnvelopeScene'
import Invitation from './components/Invitation'

const FAMILIES = {
  gashi: 'Gashi',
  hoxha: 'Hoxha',
  krasniqi: 'Krasniqi',
  berisha: 'Berisha',
  shala: 'Shala',
  ramadani: 'Ramadani',
  mustafa: 'Mustafa',
  ahmeti: 'Ahmeti',
}

function App() {
  const [opened, setOpened] = useState(false)

  const familyName = useMemo(() => {
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
      {opened && <Invitation familyName={familyName} />}
    </>
  )
}

export default App
