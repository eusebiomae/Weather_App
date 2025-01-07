import { OPEN_WEATHER_API_KEY } from './config';

export const fetchCities = async (search: string) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(search)}&limit=10&appid=${OPEN_WEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((item: any) => `${item.name}, ${item.country}`);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    throw error;
  }
};
