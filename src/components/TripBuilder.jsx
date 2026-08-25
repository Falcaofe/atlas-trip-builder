import { useState } from 'react'
import { getDestinationWeather } from '../services/openMeteo'
import WeatherCard from './WeatherCard'

const destinations = [
  { city: 'Paris', country: 'França', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85' },
  { city: 'Kyoto', country: 'Japão', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85' },
  { city: 'Bali', country: 'Indonésia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85' },
  { city: 'Lisboa', country: 'Portugal', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85' },
  { city: 'Santorini', country: 'Grécia', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85' },
  { city: 'Buenos Aires', country: 'Argentina', image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=900&q=85' }
]

const interestsList = ['Gastronomia', 'Cultura', 'Natureza', 'Compras', 'Fotografia', 'Vida noturna']

const activitiesByInterest = {
  Gastronomia: ['Café e mercado local', 'Restaurante típico', 'Experiência gastronômica'],
  Cultura: ['Museu e centro histórico', 'Marco cultural', 'Arquitetura local'],
  Natureza: ['Parque e mirante', 'Caminhada ao ar livre', 'Pôr do sol'],
  Compras: ['Distrito comercial', 'Lojas locais', 'Feira de design'],
  Fotografia: ['Ponto fotográfico', 'Caminhada fotográfica', 'Golden hour'],
  'Vida noturna': ['Bar local', 'Bairro boêmio', 'Experiência noturna']
}

const budgetParts = [
  ['Hospedagem', 0.42],
  ['Alimentação', 0.24],
  ['Passeios', 0.18],
  ['Transporte', 0.16]
]

function getSavedTrip() {
  const savedTrip = localStorage.getItem('atlas-react-trip')

  if (savedTrip) {
    return JSON.parse(savedTrip)
  }

  return {
    destination: '',
    start: '',
    end: '',
    company: '',
    interests: [],
    budget: 5000
  }
}

function getTripDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return 5
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  const difference = end - start
  const days = Math.ceil(difference / 86400000)

  return Math.max(1, days)
}

function createItinerary(trip, tripDays) {
  const selectedInterests = trip.interests.length > 0 ? trip.interests : ['Cultura']
  const itinerary = []
  const totalDays = Math.min(tripDays, 7)

  for (let index = 0; index < totalDays; index++) {
    const firstInterest = selectedInterests[index % selectedInterests.length]
    const secondInterest = selectedInterests[(index + 1) % selectedInterests.length]
    const firstActivities = activitiesByInterest[firstInterest]
    const secondActivities = activitiesByInterest[secondInterest]

    itinerary.push({
      day: index + 1,
      activities: [
        ['09:30', firstActivities[index % firstActivities.length]],
        ['14:00', secondActivities[(index + 1) % secondActivities.length]],
        ['19:30', index % 2 === 0 ? 'Jantar e passeio pela região' : 'Tempo livre para explorar']
      ]
    })
  }

  return itinerary
}

export default function TripBuilder({ onSaved }) {
  const [step, setStep] = useState(1)
  const [trip, setTrip] = useState(getSavedTrip)
  const [weatherData, setWeatherData] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')
  const [generated, setGenerated] = useState(false)

  const tripDays = getTripDays(trip.start, trip.end)
  const itinerary = createItinerary(trip, tripDays)
  const destination = destinations.find(function (item) {
    return item.city === trip.destination
  })

  function saveTrip(updatedTrip) {
    setTrip(updatedTrip)
    localStorage.setItem('atlas-react-trip', JSON.stringify(updatedTrip))

    if (onSaved) {
      onSaved(true)
    }
  }

  async function chooseDestination(city) {
    const updatedTrip = {
      ...trip,
      destination: city
    }

    saveTrip(updatedTrip)
    setWeatherLoading(true)
    setWeatherError('')
    setWeatherData(null)

    try {
      const data = await getDestinationWeather(city)
      setWeatherData(data)
    } catch (error) {
      setWeatherError(error.message)
    }

    setWeatherLoading(false)
  }

  function toggleInterest(interest) {
    const alreadySelected = trip.interests.includes(interest)
    let updatedInterests

    if (alreadySelected) {
      updatedInterests = trip.interests.filter(function (item) {
        return item !== interest
      })
    } else {
      updatedInterests = [...trip.interests, interest]
    }

    saveTrip({
      ...trip,
      interests: updatedInterests
    })
  }

  function canAdvance() {
    if (step === 1) {
      return trip.destination !== ''
    }

    if (step === 2) {
      return trip.start !== '' && trip.end !== '' && new Date(trip.end) > new Date(trip.start)
    }

    if (step === 3) {
      return trip.company !== ''
    }

    if (step === 4) {
      return trip.interests.length > 0
    }

    return true
  }

  function generateTrip() {
    const completeTrip =
      trip.destination &&
      trip.start &&
      trip.end &&
      trip.company &&
      trip.interests.length > 0

    if (!completeTrip) {
      return
    }

    saveTrip(trip)
    setGenerated(true)

    setTimeout(function () {
      const resultSection = document.getElementById('resultado')
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 20)
  }

  function editTrip() {
    setGenerated(false)
    setStep(1)

    setTimeout(function () {
      const builder = document.getElementById('builder')
      if (builder) {
        builder.scrollIntoView({ behavior: 'smooth' })
      }
    }, 10)
  }

  function formatMoney(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    })
  }

  return (
    <>
      <section className="builder" id="builder">
        <aside className="steps-panel">
          <p>SEU PLANO</p>

          <ol>
            {['Destino', 'Datas', 'Companhia', 'Interesses', 'Orçamento'].map(function (label, index) {
              return (
                <li key={label} className={step === index + 1 ? 'active' : ''}>
                  <span>{String(index + 1).padStart(2, '0')}</span> {label}
                </li>
              )
            })}
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
                {destinations.map(function (item) {
                  return (
                    <button
                      key={item.city}
                      className={`destination-option ${trip.destination === item.city ? 'selected' : ''}`}
                      onClick={function () { chooseDestination(item.city) }}
                    >
                      <img src={item.image} alt={item.city} />
                      <div>
                        <strong>{item.city}</strong>
                        <small>{item.country}</small>
                      </div>
                    </button>
                  )
                })}
              </div>

              <WeatherCard apiData={weatherData} loading={weatherLoading} error={weatherError} />

              <div className="step-actions right-only">
                <button className="next" disabled={!canAdvance()} onClick={function () { setStep(2) }}>
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
                    onChange={function (event) {
                      saveTrip({ ...trip, start: event.target.value })
                    }}
                  />
                </label>

                <label>
                  VOLTA
                  <input
                    type="date"
                    value={trip.end}
                    onChange={function (event) {
                      saveTrip({ ...trip, end: event.target.value })
                    }}
                  />
                </label>
              </div>

              <div className="step-actions">
                <button onClick={function () { setStep(1) }}>← Voltar</button>
                <button className="next" disabled={!canAdvance()} onClick={function () { setStep(3) }}>
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
                  ['Família', 'para todo mundo']
                ].map(function (option, index) {
                  const label = option[0]
                  const caption = option[1]

                  return (
                    <button
                      key={label}
                      className={trip.company === label ? 'selected' : ''}
                      onClick={function () { saveTrip({ ...trip, company: label }) }}
                    >
                      <b>{String(index + 1).padStart(2, '0')}</b>
                      <span>{label}</span>
                      <small>{caption}</small>
                    </button>
                  )
                })}
              </div>

              <div className="step-actions">
                <button onClick={function () { setStep(2) }}>← Voltar</button>
                <button className="next" disabled={!canAdvance()} onClick={function () { setStep(4) }}>
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
                {interestsList.map(function (interest) {
                  const selected = trip.interests.includes(interest)

                  return (
                    <button
                      key={interest}
                      className={selected ? 'selected' : ''}
                      onClick={function () { toggleInterest(interest) }}
                    >
                      {interest} <span>{selected ? '✓' : '＋'}</span>
                    </button>
                  )
                })}
              </div>

              <div className="step-actions">
                <button onClick={function () { setStep(3) }}>← Voltar</button>
                <button className="next" disabled={!canAdvance()} onClick={function () { setStep(5) }}>
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
                  onChange={function (event) {
                    saveTrip({ ...trip, budget: Number(event.target.value) })
                  }}
                />
              </div>

              <input
                className="budget-range"
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={Math.min(15000, trip.budget)}
                onChange={function (event) {
                  saveTrip({ ...trip, budget: Number(event.target.value) })
                }}
              />

              <div className="range-labels">
                <span>R$ 1 mil</span>
                <span>R$ 15 mil+</span>
              </div>

              <div className="step-actions">
                <button onClick={function () { setStep(4) }}>← Voltar</button>
                <button className="generate" onClick={generateTrip}>Gerar meu roteiro ✦</button>
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
                <button onClick={editTrip}>Editar viagem</button>
              </div>

              {itinerary.map(function (day) {
                return (
                  <div className="day-block" key={day.day}>
                    <div className="day-number">DIA {String(day.day).padStart(2, '0')}</div>
                    <div>
                      {day.activities.map(function (activity) {
                        const time = activity[0]
                        const description = activity[1]

                        return (
                          <div className="activity" key={`${day.day}-${time}`}>
                            <span>{time}</span>
                            <strong>{description}</strong>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <aside className="budget-card">
              <span>ESTIMATIVA</span>
              <h3>ORÇAMENTO</h3>

              {budgetParts.map(function (item) {
                const name = item[0]
                const percentage = item[1]

                return (
                  <div className="budget-row" key={name}>
                    <span>{name}</span>
                    <strong>{formatMoney(trip.budget * percentage)}</strong>
                  </div>
                )
              })}

              <div className="budget-total">
                <span>TOTAL</span>
                <strong>{formatMoney(trip.budget)}</strong>
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
