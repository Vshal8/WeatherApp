import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    useQuery,
} from '@tanstack/react-query'
import { getCurrentWeather, getWeatherForecast } from '../queries';
import { useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
const arrWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const arrDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const topRightImage = require('../assets/topRightImage.png')

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
    const [weeklyWeatherForecast, setWeeklyWeatherForecast] = useState([])

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
        let strCurrentWeather = capitalizeFirstLetter(objCurrentWeather?.weather[0]?.description)
        setCurrentWeather(strCurrentWeather)
        setCurrentWeatherImage(getIconSource(objCurrentWeather?.weather[0].icon))
        let arrWeatherReport = []
        for (var i = 0; i < 5; i++) {
            let objReport = [...objData.list].find((item, index) => {
                if (new Date(item.dt_txt).getDay() == i && 0 < Math.round(new Date(item.dt_txt).getHours() - new Date().getHours()) && Math.round(new Date(item.dt_txt).getHours() - new Date().getHours()) < 3) {
                    return item
                }
            })
            arrWeatherReport.push(objReport)
        }
        arrWeatherReport = arrWeatherReport.filter((item) => {
            if (item) {
                return item
            }
        })
        arrWeatherReport = arrWeatherReport.map((item, index) => {
            return {
                weather: capitalizeFirstLetter(item?.weather[0]?.description),
                icon: item?.weather[0]?.icon,
                maxTemperature: Math.round(item?.main?.temp_max - 273),
                minTemperature: Math.round(item?.main?.temp_min - 273),
                day: arrDays[new Date(item.dt_txt).getDay()]
            }
        })
        setWeeklyWeatherForecast(arrWeatherReport)
    }

    const capitalizeFirstLetter = (string) => {
        let arrString = string.split(" ");
        for (var i = 0; i < arrString.length; i++) {
            arrString[i] = arrString[i].charAt(0).toUpperCase() + arrString[i].slice(1);

        }
        let strCurrentWeather = arrString.join(" ");
        return strCurrentWeather;
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

    const SingleWeatherReport = ({ day, maxTemperature, minTemperature, icon, weather }) => {
        return <View className='flex flex-row mt-4 items-center'>
            <View className='flex-row w-1/4'>
                <Text className='text-sm text-dark-gray-text font-regular'>
                    {day}
                </Text>
            </View>
            <View className='flex-row w-1/4'>
                <Text className='text-sm font-regular'>
                    {maxTemperature + '\u00b0'}
                </Text>
                <Text className='text-xs text-dark-gray-text font-regular ml-2'>
                    {minTemperature + '\u00b0'}
                </Text>
            </View>
            <View className='flex-row w-1/2 overflow-hidden truncate'>
                <Image className='h-6 w-8 mr-2' source={{ uri: getIconSource(icon) }} resizeMode='stretch' />
                <Text numberOfLines={1} className='text-sm text-dark-gray-text font-regular'>
                    {weather}
                </Text>
            </View>
        </View>
    }

    return <SafeAreaView className={`flex flex-1`}>
        <View className={'flex flex-1 bg-base-bg py-6 px-4'}>
            <View className={'flex flex-1 rounded-3xl bg-[#ffffff] p-4'}>
                <View className='flex flex-row w-full justify-between'>
                    <View>
                        <Text className='text-xl font-medium'>{cityName}</Text>
                        <Text className='text-sm text-gray-text font-regular'>{getCurrentDayTime}</Text>
                    </View>
                    <Image source={topRightImage} className='h-8 w-8 self-start' />
                </View>
                <Image source={{ uri: currentWeatherImage }} className='h-20 w-20 self-center mt-10' resizeMode='stretch' />
                <Text className='text-3xl font-bold self-center'>{currentTemperature + '\u00b0'}</Text>
                <Text className='text-sm text-gray-text font-regular self-center'>{currentWeather}</Text>
                <View className={'flex flex-1 rounded-3xl bg-light-bg p-4 mt-4'}>
                    <Text className='text-lg font-bold'>This week</Text>
                    {weeklyWeatherForecast.map((item, index) => {
                        return <SingleWeatherReport key={`${index} day`} day={item.day} icon={item.icon} weather={item.weather} maxTemperature={item.maxTemperature} minTemperature={item.minTemperature} />
                    })}
                </View>
            </View>
        </View>
    </SafeAreaView>
}