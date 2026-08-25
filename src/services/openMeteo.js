const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function searchLocation(city) {
  const response = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
  )

  if (!response.ok) {
    throw new Error('Não foi possível buscar a localização.')
  }

  const data = await response.json()
  const location = data.results?.[0]

  if (!location) {
    throw new Error('Destino não encontrado pela API.')
  }

  return {
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  }
}

export async function getWeather(latitude, longitude, timezone = 'auto') {
  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone,
    current_weather: 'true',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    forecast_days: '7',
  })

  const response = await fetch(`${FORECAST_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Não foi possível carregar a previsão.')
  }

  return response.json()
}

export async function getDestinationWeather(city) {
  const location = await searchLocation(city)
  const forecast = await getWeather(
    location.latitude,
    location.longitude,
    location.timezone || 'auto'
  )

  return { location, forecast }
}
