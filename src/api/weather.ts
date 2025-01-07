import { OPEN_WEATHER_API_KEY } from './config';

const baseUrl = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city: string | { lat: number; lng: number }) => {
  let url = `${baseUrl}/weather?appid=${OPEN_WEATHER_API_KEY}`;

  if (typeof city === 'string') {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (typeof city === 'object') {
    url += `&lat=${city.lat}&lon=${city.lng}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    throw error;
  }
};

export const fetchExtendedForecastData = async (city: string | { lat: number; lng: number }) => {
  let url = `${baseUrl}/forecast/daily?appid=${OPEN_WEATHER_API_KEY}`;

  if (typeof city === 'string') {
    url += `&q=${encodeURIComponent(city)}`;
  } else if (typeof city === 'object') {
    url += `&lat=${city.lat}&lon=${city.lng}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar previsão estendida:', error);
    throw error;
  }
};
