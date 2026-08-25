import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TripBuilder from './components/TripBuilder'

export default function App() {
  const [saved, setSaved] = useState(Boolean(localStorage.getItem('atlas-react-trip')))

  return (
    <>
      <Header saved={saved} />
      <main>
        <Hero />
        <TripBuilder onSaved={setSaved} />
      </main>

      <footer className="footer">
        <div>
          <strong>ATLAS</strong>
          <span>Projeto de estudos em React</span>
        </div>

        <p>React • Open-Meteo API • localStorage</p>
      </footer>
    </>
  )
}
