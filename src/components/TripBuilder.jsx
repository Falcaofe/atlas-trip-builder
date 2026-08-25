import { useMemo, useState } from 'react'
import { getDestinationWeather } from '../services/openMeteo'
import WeatherCard from './WeatherCard'

const DESTINATIONS = [
  {
    city: 'Paris',
    country: 'França',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85',
  },
  {
    city: 'Kyoto',
    country: 'Japão',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85',
  },
  {
    city: 'Bali',
    country: 'Indonésia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85',
  },
  {
    city: 'Lisboa',
    country: 'Portugal',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85',
  },
  {
    city: 'Santorini',
    country: 'Grécia',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85',
  },
  {
    city: 'Buenos Aires',
    country: 'Argentina',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=900&q=85',
  },
]

const INTERESTS = ['Gastronomia', 'Cultura', 'Natureza', 'Compras', 'Fotografia', 'Vida noturna']

const ACTIVITY_BANK = {
  Gastronomia: ['Café e mercado local', 'Restaurante típico', 'Experiência gastronômica'],
  Cultura: ['Museu e centro histórico', 'Marco cultural', 'Arquitetura local'],
  Natureza: ['Parque e mirante', 'Caminhada ao ar livre', 'Pôr do sol'],
  Compras: ['Distrito comercial', 'Lojas locais', 'Feira de design'],
  Fotografia: ['Ponto fotográfico', 'Caminhada fotográfica', 'Golden hour'],
  'Vida noturna': ['Bar local', 'Bairro boêmio', 'Experiência noturna'],
}

export default function TripBuilder({ onSaved }) {
  const initial = JSON.parse(localStorage.getItem('atlas-react-trip') || 'null') || {
    destination: '',
    start: '',
    end: '',
    company: '',
    interests: [],
    budget: 5000,
  }

  const [step, setStep] = useState(1)
  const [trip, setTrip] = useState(initial)
  const [apiData, setApiData] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [generated, setGenerated] = useState(false)

  const destination = DESTINATIONS.find(item => item.city === trip.destination)

  const tripDays = useMemo(() => {
    if (!trip.start || !trip.end) return 5
    const start = new Date(trip.start)
    const end = new Date(trip.end)
    return Math.max(1, Math.ceil((end - start) / 86400000))
  }, [trip.start, trip.end])

  const save = nextTrip => {
    setTrip(nextTrip)
    localStorage.setItem('atlas-react-trip', JSON.stringify(nextTrip))
    onSaved?.(true)
  }

  const chooseDestination = async city => {
    const next = { ...trip, destination: city }
    save(next)
    setApiLoading(true)
    setApiError('')
    setApiData(null)

    try {
      const data = await getDestinationWeather(city)
      setApiData(data)
    } catch (error) {
      setApiError(error.message)
    } finally {
      setApiLoading(false)
    }
  }

  const toggleInterest = interest => {
    const exists = trip.interests.includes(interest)
    save({
      ...trip,
      interests: exists
        ? trip.interests.filter(item => item !== interest)
        : [...trip.interests, interest],
    })
  }

  const canAdvance = () => {
    if (step === 1) return Boolean(trip.destination)
    if (step === 2) return Boolean(trip.start && trip.end && new Date(trip.end) > new Date(trip.start))
    if (step === 3) return Boolean(trip.company)
    if (step === 4) return trip.interests.length > 0
    return true
  }

  const generate = () => {
    if (!trip.destination || !trip.start || !trip.end || !trip.company || !trip.interests.length) {
      return
    }
    save(trip)
    setGenerated(true)
    setTimeout(() => document.querySelector('#resultado')?.scrollIntoView({ behavior: 'smooth' }), 20)
  }

  const itinerary = useMemo(() => {
    const interests = trip.interests.length ? trip.interests : ['Cultura']

    return Array.from({ length: Math.min(tripDays, 7) }, (_, index) => {
      const first = interests[index % interests.length]
      const second = interests[(index + 1) % interests.length]
      const firstActivities = ACTIVITY_BANK[first]
      const secondActivities = ACTIVITY_BANK[second]

      return {
        day: index + 1,
        activities: [
          ['09:30', firstActivities[index % firstActivities.length]],
          ['14:00', secondActivities[(index + 1) % secondActivities.length]],
          ['19:30', index % 2 ? 'Tempo livre para explorar' : 'Jantar e passeio pela região'],
        ],
      }
    })
  }, [trip.interests, tripDays])

  const breakdown = [
    ['Hospedagem', 0.42],
    ['Alimentação', 0.24],
    ['Passeios', 0.18],
    ['Transporte', 0.16],
  ]

  return (
    <>
      <section className="builder" id="builder">
        <aside className="steps-panel">
          <p>SEU PLANO</p>

          <ol>
            {['Destino', 'Datas', 'Companhia', 'Interesses', 'Orçamento'].map((label, index) => (
              <li key={label} className={step === index + 1 ? 'active' : ''}>
                <span>{String(index + 1).padStart(2, '0')}</span> {label}
              </li>
            ))}
          </ol>

          <div className="progress">
            <i style={{ width: `${step * 20}%` }}></i>
          </div>
          <small>Etapa {step} de 5</small>
        </aside>

        <div className="step-stage">
          {step === 1 && (
            <section className="step active">
              <span className="step-kicker">01 / DESTINO</span>
              <h2>Qual cenário vai<br />virar memória?</h2>

              <div className="destination-options">
                {DESTINATIONS.map(item => (
                  <button
                    key={item.city}
                    className={`destination-option ${trip.destination === item.city ? 'selected' : ''}`}
                    onClick={() => chooseDestination(item.city)}
                  >
                    <img src={item.image} alt={item.city} />
                    <div>
                      <strong>{item.city}</strong>
                      <small>{item.country}</small>
                    </div>
                  </button>
                ))}
              </div>

              <WeatherCard apiData={apiData} loading={apiLoading} error={apiError} />

              <div className="step-actions right-only">
                <button
                  className="next"
                  disabled={!canAdvance()}
                  onClick={() => setStep(2)}
                >
                  Continuar →
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="step active">
              <span className="step-kicker">02 / DATAS</span>
              <h2>Quando a aventura<br />começa?</h2>

              <div className="date-grid">
                <label>
                  IDA
                  <input
                    type="date"
                    value={trip.start}
                    onChange={event => save({ ...trip, start: event.target.value })}
                  />
                </label>

                <label>
                  VOLTA
                  <input
                    type="date"
                    value={trip.end}
                    onChange={event => save({ ...trip, end: event.target.value })}
                  />
                </label>
              </div>

              <div className="step-actions">
                <button onClick={() => setStep(1)}>← Voltar</button>
                <button className="next" disabled={!canAdvance()} onClick={() => setStep(3)}>
                  Continuar →
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="step active">
              <span className="step-kicker">03 / COMPANHIA</span>
              <h2>Quem embarca<br />com você?</h2>

              <div className="choice-grid">
                {[
                  ['Solo', 'liberdade total'],
                  ['Casal', 'dois na rota'],
                  ['Amigos', 'histórias em grupo'],
                  ['Família', 'para todo mundo'],
                ].map(([label, caption], index) => (
                  <button
                    key={label}
                    className={trip.company === label ? 'selected' : ''}
                    onClick={() => save({ ...trip, company: label })}
                  >
                    <b>{String(index + 1).padStart(2, '0')}</b>
                    <span>{label}</span>
                    <small>{caption}</small>
                  </button>
                ))}
              </div>

              <div className="step-actions">
                <button onClick={() => setStep(2)}>← Voltar</button>
                <button className="next" disabled={!canAdvance()} onClick={() => setStep(4)}>
                  Continuar →
                </button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="step active">
              <span className="step-kicker">04 / INTERESSES</span>
              <h2>O que não pode<br />faltar?</h2>

              <div className="interest-grid">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    className={trip.interests.includes(interest) ? 'selected' : ''}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest} <span>{trip.interests.includes(interest) ? '✓' : '＋'}</span>
                  </button>
                ))}
              </div>

              <div className="step-actions">
                <button onClick={() => setStep(3)}>← Voltar</button>
                <button className="next" disabled={!canAdvance()} onClick={() => setStep(5)}>
                  Continuar →
                </button>
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="step active">
              <span className="step-kicker">05 / ORÇAMENTO</span>
              <h2>Quanto você quer<br />investir na viagem?</h2>

              <div className="budget-box">
                <span>R$</span>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={trip.budget}
                  onChange={event => save({ ...trip, budget: Number(event.target.value) })}
                />
              </div>

              <input
                className="budget-range"
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={Math.min(15000, trip.budget)}
                onChange={event => save({ ...trip, budget: Number(event.target.value) })}
              />

              <div className="range-labels">
                <span>R$ 1 mil</span>
                <span>R$ 15 mil+</span>
              </div>

              <div className="step-actions">
                <button onClick={() => setStep(4)}>← Voltar</button>
                <button className="generate" onClick={generate}>Gerar meu roteiro ✦</button>
              </div>
            </section>
          )}
        </div>
      </section>

      {generated && (
        <section className="result show" id="resultado">
          <div className="result-head">
            <div>
              <span className="result-label">ATLAS / REACT RESULT</span>
              <h2>{trip.destination.toUpperCase()}</h2>
              <p>{tripDays} dias · {trip.company} · {trip.interests.join(' + ')}</p>
            </div>

            <div className="big-days">
              <strong>{String(tripDays).padStart(2, '0')}</strong>
              <span>DIAS</span>
            </div>
          </div>

          <div className="result-layout">
            <div className="timeline-wrap">
              <div className="timeline-head">
                <h3>ITINERÁRIO</h3>
                <button onClick={() => {
                  setGenerated(false)
                  setStep(1)
                  setTimeout(() => document.querySelector('#builder')?.scrollIntoView({ behavior: 'smooth' }), 10)
                }}>Editar viagem</button>
              </div>

              {itinerary.map(day => (
                <div className="day-block" key={day.day}>
                  <div className="day-number">DIA {String(day.day).padStart(2, '0')}</div>
                  <div>
                    {day.activities.map(([time, activity]) => (
                      <div className="activity" key={`${day.day}-${time}`}>
                        <span>{time}</span>
                        <strong>{activity}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <aside className="budget-card">
              <span>ESTIMATIVA</span>
              <h3>ORÇAMENTO</h3>

              {breakdown.map(([name, percentage]) => (
                <div className="budget-row" key={name}>
                  <span>{name}</span>
                  <strong>
                    {(trip.budget * percentage).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    })}
                  </strong>
                </div>
              ))}

              <div className="budget-total">
                <span>TOTAL</span>
                <strong>
                  {trip.budget.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    maximumFractionDigits: 0,
                  })}
                </strong>
              </div>
            </aside>
          </div>

          {destination && (
            <div className="trip-poster">
              <img src={destination.image} alt={trip.destination} />
              <div className="poster-copy">
                <span>YOUR NEXT STORY</span>
                <strong>{trip.destination.toUpperCase()}</strong>
                <small>ATLAS / REACT + OPEN-METEO API</small>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  )
}
