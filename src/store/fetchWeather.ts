import { createAsyncThunk } from '@reduxjs/toolkit';
import { ExtendedForecastData, WeatherData } from '../api/types';
import { fetchExtendedForecastData, fetchWeatherData } from '../api/weather';
import { getNextFiveDays } from '../utils/dateUtils';
import { kelvinToCelcius } from '../utils/unitConversion';
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
  res: { weatherData: any; extendedForecastData: any }
): {
  weather: WeatherData;
  forecast: ExtendedForecastData[];
} => {
  const { weatherData, extendedForecastData } = res;

  const weather: WeatherData = {
    ...weatherData,
    weather: weatherData.weather[0],
    main: {
      ...weatherData.main,
      temp: kelvinToCelcius(weatherData.main.temp),
      feels_like: kelvinToCelcius(weatherData.main.feels_like),
      temp_max: kelvinToCelcius(weatherData.main.temp_max),
      temp_min: kelvinToCelcius(weatherData.main.temp_min),
    },
    wind: {
      ...weatherData.wind,
      speed: Math.round(weatherData.wind.speed * 3.6), // Conversão m/s para km/h
    },
  };

  const forecast: ExtendedForecastData[] = [];
  const next5Days = getNextFiveDays();

  if (extendedForecastData.list) {
    extendedForecastData.list.slice(0, 5).forEach((item: any, index: number) => {
      forecast.push({
        day: next5Days[index],
        temp: {
          temp_max: kelvinToCelcius(item.temp.max),
          temp_min: kelvinToCelcius(item.temp.min),
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

