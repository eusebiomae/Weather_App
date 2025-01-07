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
  const weather = res[0] as WeatherData;
  const extendedForecastData = res[1];
  const forecast: ExtendedForecastData[] = [];

  // Atualizar os dados atuais (res[0]) para usar fahrenheitToCelcius
  weather.weather = res[0].weather[0];
  weather.main = {
    ...weather.main,
    temp: fahrenheitToCelcius(weather.main.temp),
    feels_like: fahrenheitToCelcius(weather.main.feels_like),
    temp_max: fahrenheitToCelcius(weather.main.temp_max),
    temp_min: fahrenheitToCelcius(weather.main.temp_min),
  };
  weather.wind.speed = Math.round(weather.wind.speed * 3.6);

  const next5Days = getNextFiveDays();

  // Processar os dados da previsão estendida (res[1])
  if (extendedForecastData.list) {
    extendedForecastData.list.slice(0, 5).forEach((item: any, index: number) => {
      forecast.push({
        day: next5Days[index],
        temp: {
          temp_max: fahrenheitToCelcius(item.main.temp_max), // Correção: usar item.main.temp_max
          temp_min: fahrenheitToCelcius(item.main.temp_min), // Correção: usar item.main.temp_min
        },
        weather: {
          id: item.weather[0].id,
          main: item.weather[0].main,
        },
      });
    });
  }

  return {
    weather,
    forecast,
  };
};

