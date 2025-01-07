// import { OPEN_WEATHER_API_KEY } from './config';

const baseUrl = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city: string | { lat: number; lng: number }) => {
  const apiKey = 'a3176e67fb0ebf0258a528fa365e64d6'; // Sua chave
  let url = `${baseUrl}/weather?appid=${apiKey}`;

  if (typeof city === 'string') {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (typeof city === 'object') {
    url += `&lat=${city.lat}&lon=${city.lng}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
  }
  return await response.json();
};

export const fetchExtendedForecastData = async (city: string | { lat: number; lng: number }) => {
  const apiKey = 'a3176e67fb0ebf0258a528fa365e64d6'; // Sua chave de API
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  if (typeof city === 'string') {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (typeof city === 'object') {
    url += `&lat=${city.lat}&lon=${city.lng}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
  }
  return await response.json();
};
