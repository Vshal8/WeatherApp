import axios from 'axios';
import { WEATHER_API_KEY } from './globalConstants';

export const getWeatherDetails = async (params) => {
    const location = params['queryKey'][1]
    let lat = location['latitude']
    let long = location['longitude']
    let response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&cnt={7}&appid=${WEATHER_API_KEY}`)
    console.log('Status of response is', response.status)
    return response.data
} 