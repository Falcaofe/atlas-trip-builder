const geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search'
const forecastUrl = 'https://api.open-meteo.com/v1/forecast'

export async function searchLocation(city) {
  const url = `${geocodingUrl}?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Não foi possível buscar a localização.')
  }

  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    throw new Error('Destino não encontrado pela API.')
  }

  const location = data.results[0]

  return {
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone
  }
}

export async function getWeather(latitude, longitude, timezone) {
  const selectedTimezone = timezone || 'auto'

  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,
    timezone: selectedTimezone,
    current_weather: 'true',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    forecast_days: '7'
  })

  const response = await fetch(`${forecastUrl}?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Não foi possível carregar a previsão.')
  }

  const data = await response.json()
  return data
}

export async function getDestinationWeather(city) {
  const location = await searchLocation(city)
  const forecast = await getWeather(
    location.latitude,
    location.longitude,
    location.timezone
  )

  return {
    location: location,
    forecast: forecast
  }
}
