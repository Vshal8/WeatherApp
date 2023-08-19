import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    useQuery,
} from '@tanstack/react-query'
import { getWeatherDetails } from '../queries';
import { useMemo } from 'react';

const arrWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const weatherDummyData = {
    "city": {
        "id": 3163858,
        "name": "Calicut, Kerala",
        "coord": {
            "lon": 10.99,
            "lat": 44.34
        },
        "country": "IND",
        "population": 4593,
        "timezone": 7200
    },
    "cod": "200",
    "message": 0.0582563,
    "cnt": 7,
    "list": [
        {
            "dt": 1661857200,
            "sunrise": 1661834187,
            "sunset": 1661882248,
            "temp": {
                "day": 299.66,
                "min": 288.93,
                "max": 299.66,
                "night": 290.31,
                "eve": 297.16,
                "morn": 288.93
            },
            "feels_like": {
                "day": 299.66,
                "night": 290.3,
                "eve": 297.1,
                "morn": 288.73
            },
            "pressure": 1017,
            "humidity": 44,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "speed": 2.7,
            "deg": 209,
            "gust": 3.58,
            "clouds": 53,
            "pop": 0.7,
            "rain": 2.51
        },
        {
            "dt": 1661943600,
            "sunrise": 1661920656,
            "sunset": 1661968542,
            "temp": {
                "day": 295.76,
                "min": 287.73,
                "max": 295.76,
                "night": 289.37,
                "eve": 292.76,
                "morn": 287.73
            },
            "feels_like": {
                "day": 295.64,
                "night": 289.45,
                "eve": 292.97,
                "morn": 287.59
            },
            "pressure": 1014,
            "humidity": 60,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "speed": 2.29,
            "deg": 215,
            "gust": 3.27,
            "clouds": 66,
            "pop": 0.82,
            "rain": 5.32
        },
        {
            "dt": 1662030000,
            "sunrise": 1662007126,
            "sunset": 1662054835,
            "temp": {
                "day": 293.38,
                "min": 287.06,
                "max": 293.38,
                "night": 287.06,
                "eve": 289.01,
                "morn": 287.84
            },
            "feels_like": {
                "day": 293.31,
                "night": 287.01,
                "eve": 289.05,
                "morn": 287.85
            },
            "pressure": 1014,
            "humidity": 71,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "speed": 2.67,
            "deg": 60,
            "gust": 2.66,
            "clouds": 97,
            "pop": 0.84,
            "rain": 4.49
        }
    ]
}

const imageSource = require('../assets/weatherUpdate.png')

export default function Page() {

    const { data, isLoading, isError } = useQuery(['weatherData'], getWeatherDetails, {
        cacheTime: 7200000, //Data is cached for two hours
        refetchInterval: 7200000, //Data is refetched after every two hours
        refetchIntervalInBackground: true //Fetch data after 2 hours even if app is in background state
    })

    console.log('Loading is', isLoading)
    console.log('Error is', isError)
    console.log('Data is', data)

    const getCurrentDayTime = useMemo(() => {
        let currentDay = new Date().getDay()
        currentDay = arrWeekDays[currentDay]
        let currentTime = new Date().getHours()
        if (currentTime > 12) {
            currentTime = `${currentTime - 12} PM`
        }
        else {
            currentTime = `${currentTime} AM`
        }
        return `${currentDay}, ${currentTime}`
    }, [new Date().getHours(),new Date().getDay()])

    if (isLoading) {
        return <View className='flex flex-1 items-center justify-center'>
            <ActivityIndicator size={'large'} color={'#d7d7d7'} />
        </View>
    }

    return <SafeAreaView className={`flex flex-1`}>
        <View className={'flex flex-1 bg-base-bg py-6 px-4'}>
            <View className={'flex flex-1 rounded-3xl bg-[#ffffff] p-4'}>
                <Text className='text-xl font-medium'>Calicut, Kerala</Text>
                <Text className='text-sm text-gray-text font-regular'>{getCurrentDayTime}</Text>
                <Image source={imageSource} className='h-20 w-32 self-center mt-10' resizeMode='stretch' />
                <Text className='text-3xl font-bold mt-2 self-center'>28</Text>
                <Text className='text-sm text-gray-text font-regular self-center'>Partly Cloudy</Text>
                <View className={'flex flex-1 rounded-3xl bg-light-bg p-4'}>
                    <Text className='text-lg font-bold'>This week</Text>
                    {arrWeekDays.map((item, index) => {
                        return <View className='flex flex-row mt-4 items-center'>
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