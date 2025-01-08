import { OPEN_WEATHER_API_KEY } from './config';

const baseUrl = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city: string | { lat: number; lng: number }) => {
  // Usando a chave da API a partir de uma variável de configuração
  const apiKey = OPEN_WEATHER_API_KEY;
  let url = `${baseUrl}/weather?appid=${apiKey}&units=metric`; // Alterado para Celsius

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
  // Usando a chave da API a partir de uma variável de configuração
  const apiKey = OPEN_WEATHER_API_KEY;
  let url = `${baseUrl}/forecast?appid=${apiKey}&units=metric`; // Alterado para Celsius

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
