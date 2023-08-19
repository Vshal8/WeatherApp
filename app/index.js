import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    useQuery,
} from '@tanstack/react-query'
import { getCurrentWeather, getWeatherForecast } from '../queries';
import { useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
const arrWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const imageSource = require('../assets/weatherUpdate.png')

const getIconSource = (iconCode) => {
    return `http://openweathermap.org/img/w/${iconCode}.png`
}

export default function Page() {

    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [cityName, setCityName] = useState('Calicut')
    const [currentWeatherTimestamp, setCurrentWeatherTimestamp] = useState(new Date().getTime())
    const [currentTemperature, setCurrentTemperature] = useState(0)
    const [currentWeather, setCurrentWeather] = useState('')
    const [currentWeatherImage, setCurrentWeatherImage] = useState('')

    useEffect(() => {
        getInitialData()
    }, [])


    const getInitialData = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            //If permission denied, then default location is set
            setLatitude(12.93)
            setLongitude(77.63)
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        let lat = location?.coords?.latitude
        let long = location?.coords?.longitude
        setLatitude(lat)
        setLongitude(long)
    }

    //Query to fetch 3 hours forecast for 5 days' weather 
    const { data, isLoading, isError, } = useQuery(['weatherData', { latitude: latitude, longitude: longitude }], getWeatherForecast, {
        cacheTime: 7200000, //Data is cached for two hours
        refetchInterval: 7200000, //Data is refetched after every two hours
        refetchIntervalInBackground: true, //Fetch data after 2 hours even if app is in background state
        enabled: !!latitude && !!longitude //Wait for latitude and longitude data to fetch data
    })

    //Query to fetch current weather report for current location
    const { data: currentWeatherForecast, isLoading: isCurrentWeatherForecastLoading, } = useQuery(['currentWeather', { latitude: latitude, longitude: longitude }], getCurrentWeather, {
        cacheTime: 7200000, //Data is cached for two hours
        refetchInterval: 7200000, //Data is refetched after every two hours
        refetchIntervalInBackground: true, //Fetch data after 2 hours even if app is in background state
        enabled: !!latitude && !!longitude //Wait for latitude and longitude data to fetch data
    })

    useEffect(() => {
        if (data && Object.keys(data).length > 0 && currentWeatherForecast && Object.keys(currentWeatherForecast).length > 0) {
            restructureWeatherData()
        }
    }, [data, currentWeatherForecast])

    const restructureWeatherData = () => {
        let objData = { ...data }
        let objCurrentWeather = { ...currentWeatherForecast }
        setCityName(objCurrentWeather?.name)
        setCurrentWeatherTimestamp(objCurrentWeather?.dt * 1000)
        setCurrentTemperature(Math.round((objCurrentWeather?.main?.temp) - 273))
        let arrStrCurrentWeather = (objCurrentWeather?.weather[0]?.description).split(" ");
        for (var i = 0; i < arrStrCurrentWeather.length; i++) {
            arrStrCurrentWeather[i] = arrStrCurrentWeather[i].charAt(0).toUpperCase() + arrStrCurrentWeather[i].slice(1);

        }
        let strCurrentWeather = arrStrCurrentWeather.join(" ");
        setCurrentWeather(strCurrentWeather)
        setCurrentWeatherImage(getIconSource(objCurrentWeather?.weather[0].icon))
    }

    const getCurrentDayTime = useMemo(() => {
        let currentDay = new Date(currentWeatherTimestamp).getDay()
        currentDay = arrWeekDays[currentDay]
        let currentTime = new Date(currentWeatherTimestamp).getHours()
        if (currentTime > 12) {
            currentTime = `${currentTime - 12} PM`
        }
        else {
            currentTime = `${currentTime} AM`
        }
        return `${currentDay}, ${currentTime}`
    }, [currentWeatherTimestamp])

    if (isLoading || isCurrentWeatherForecastLoading) {
        return <View className='flex flex-1 items-center justify-center'>
            <ActivityIndicator size={'large'} color={'#d7d7d7'} />
        </View>
    }

    return <SafeAreaView className={`flex flex-1`}>
        <View className={'flex flex-1 bg-base-bg py-6 px-4'}>
            <View className={'flex flex-1 rounded-3xl bg-[#ffffff] p-4'}>
                <Text className='text-xl font-medium'>{cityName}</Text>
                <Text className='text-sm text-gray-text font-regular'>{getCurrentDayTime}</Text>
                <Image source={{ uri: currentWeatherImage }} className='h-20 w-20 self-center mt-10' resizeMode='stretch' />
                <Text className='text-3xl font-bold self-center'>{currentTemperature + '\u00b0'}</Text>
                <Text className='text-sm text-gray-text font-regular self-center'>{currentWeather}</Text>
                <View className={'flex flex-1 rounded-3xl bg-light-bg p-4 mt-4'}>
                    <Text className='text-lg font-bold'>This week</Text>
                    {arrWeekDays.map((item, index) => {
                        return <View key={`${index} day`} className='flex flex-row mt-4 items-center'>
                            <View className='flex-row w-1/4'>
                                <Text className='text-sm text-gray-text font-regular'>
                                    MON
                                </Text>
                            </View>
                            <View className='flex-row w-1/4'>
                                <Text className='text-sm font-regular'>
                                    28
                                </Text>
                                <Text className='text-sm text-gray-text font-regular ml-2'>
                                    18
                                </Text>
                            </View>
                            <View className='flex-row w-1/2 overflow-hidden truncate'>
                                <Image className='h-6 w-8 mr-2' source={imageSource} resizeMode='stretch' />
                                <Text numberOfLines={1} className='text-sm text-gray-text font-regular'>
                                    {index == 0 ? 'csacascjksankj' : index == 3 ? 'usbcsb' : 'asiucvbasjkcbsakjcbasjkb'}
                                </Text>
                            </View>
                        </View>
                    })}
                </View>
            </View>
        </View>
    </SafeAreaView>
}