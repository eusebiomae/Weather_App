// import { OPEN_WEATHER_API_KEY } from './config';

const baseUrl = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city: string | { lat: number; lng: number }) => {
  const apiKey = '9fc914390eb02e967b8829babae34155'; // Sua chave
  let url = `${baseUrl}/weather?q=${city}&appid=${apiKey}&units=imperial`;

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
  const apiKey = '9fc914390eb02e967b8829babae34155';
  let url = `${baseUrl}/forecast?appid=${apiKey}`;

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

