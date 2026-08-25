function weatherLabel(code) {
  if (code === 0) return 'Céu limpo'
  if ([1, 2, 3].includes(code)) return 'Parcialmente nublado'
  if ([45, 48].includes(code)) return 'Neblina'
  if ([51, 53, 55, 61, 63, 65].includes(code)) return 'Chuva'
  if ([71, 73, 75].includes(code)) return 'Neve'
  if ([80, 81, 82].includes(code)) return 'Pancadas de chuva'
  if ([95, 96, 99].includes(code)) return 'Trovoadas'
  return 'Condição variável'
}

export default function WeatherCard({ apiData, loading, error }) {
  if (loading) {
    return <div className="weather-card loading-card">Consultando Open-Meteo…</div>
  }

  if (error) {
    return <div className="weather-card error-card">{error}</div>
  }

  if (!apiData) {
    return (
      <div className="weather-card empty-weather">
        <span>API</span>
        <strong>Dados reais aparecem aqui</strong>
        <p>Escolha um destino para consultar localização e clima.</p>
      </div>
    )
  }

  const { location, forecast } = apiData
  const current = forecast.current_weather
  const daily = forecast.daily

  return (
    <div className="weather-card">
      <div className="weather-head">
        <div>
          <span>OPEN-METEO / LIVE DATA</span>
          <strong>{location.name}, {location.country}</strong>
        </div>

        <div className="temperature">
          {Math.round(current?.temperature ?? daily.temperature_2m_max[0])}°
        </div>
      </div>

      <p className="weather-label">{weatherLabel(current?.weathercode ?? daily.weather_code[0])}</p>

      <div className="weather-week">
        {daily.time.slice(0, 5).map((date, index) => (
          <div key={date}>
            <span>{new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
            <strong>{Math.round(daily.temperature_2m_max[index])}°</strong>
            <small>{Math.round(daily.temperature_2m_min[index])}°</small>
          </div>
        ))}
      </div>

      <small className="api-source">Dados meteorológicos: Open-Meteo</small>
    </div>
  )
}
