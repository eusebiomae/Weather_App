import { createAsyncThunk } from '@reduxjs/toolkit';
import { ExtendedForecastData, WeatherData } from '../api/types';
import { fetchExtendedForecastData, fetchWeatherData } from '../api/weather';
import { getNextFiveDays } from '../utils/dateUtils';
import { fahrenheitToCelcius } from '../utils/unitConversion';
import { setIsInitial, setIsLoading } from './reducers/appReducer';

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string | { lat: number; lng: number }, { dispatch, rejectWithValue }) => {
    dispatch(setIsLoading(true));

    try {
      const [weatherData, extendedForecastData] = await Promise.all([
        fetchWeatherData(city),
        fetchExtendedForecastData(city),
      ]);

      dispatch(setIsLoading(false));

      if (weatherData.cod === 200) {
        dispatch(setIsInitial(false));
        return { weatherData, extendedForecastData };
      } else {
        return rejectWithValue(weatherData.message || 'Erro ao buscar dados do clima.');
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido.');
    }
  }
);


export const transformWeatherData = (
  res: any
): {
  weather: WeatherData;
  forecast: ExtendedForecastData[];
} => {
  console.log('Dados recebidos da API:', res); // Log para depuração
  
  if (!res || typeof res !== 'object') {
    console.error('Resposta inválida da API:', res);
    throw new Error('Os dados recebidos da API estão incompletos ou inválidos.');
  }

  // Extração de dados do clima atual
  const currentWeatherData = res[0];
  if (
    !currentWeatherData ||
    !currentWeatherData.main ||
    !currentWeatherData.weather ||
    !Array.isArray(currentWeatherData.weather) ||
    currentWeatherData.weather.length === 0 ||
    !currentWeatherData.wind
  ) {
    console.error('Dados incompletos para o clima atual:', currentWeatherData);
    throw new Error('Os dados do clima atual estão incompletos ou inválidos.');
  }

  const weather: WeatherData = {
    ...currentWeatherData,
    weather: currentWeatherData.weather[0], // Primeiro item do array
    main: {
      ...currentWeatherData.main,
      temp: fahrenheitToCelcius(currentWeatherData.main.temp),
      feels_like: fahrenheitToCelcius(currentWeatherData.main.feels_like),
      temp_max: fahrenheitToCelcius(currentWeatherData.main.temp_max),
      temp_min: fahrenheitToCelcius(currentWeatherData.main.temp_min),
    },
    wind: {
      ...currentWeatherData.wind,
      speed: Math.round(currentWeatherData.wind.speed * 3.6), // Converter para km/h
    },
  };

  // Extração de dados de previsão estendida
  const extendedForecastData = res[1];
  const forecast: ExtendedForecastData[] = [];
  if (
    extendedForecastData &&
    extendedForecastData.list &&
    Array.isArray(extendedForecastData.list)
  ) {
    const next5Days = getNextFiveDays();
    extendedForecastData.list.slice(0, 5).forEach((item: any, index: number) => {
      if (
        item &&
        item.main &&
        item.weather &&
        Array.isArray(item.weather) &&
        item.weather.length > 0
      ) {
        forecast.push({
          day: next5Days[index],
          temp: {
            temp_max: fahrenheitToCelcius(item.main.temp_max),
            temp_min: fahrenheitToCelcius(item.main.temp_min),
          },
          weather: {
            id: item.weather[0].id,
            main: item.weather[0].main,
          },
        });
      }
    });
  }

  return { weather, forecast };
};
