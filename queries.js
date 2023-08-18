import axios from 'axios';
import { WEATHER_API_KEY } from './globalConstants';

export const getWeatherDetails = async () => {
    let response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat={11.25}&lon={75.78}&cnt={7}&appid=${WEATHER_API_KEY}`)
    console.log('Status of response is', response.status)
    return response.data
} 