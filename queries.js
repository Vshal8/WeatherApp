import axios from 'axios';
import { WEATHER_API_KEY } from './globalConstants';

export const getWeatherForecast = async (params) => {
    const location = params['queryKey'][1]
    let lat = location['latitude']
    let long = location['longitude']
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`)
    return response.data
}

export const getCurrentWeather = async (params) => {
    const location = params['queryKey'][1]
    let lat = location['latitude']
    let long = location['longitude']
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`)
    return response.data
}