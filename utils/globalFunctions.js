//Array of week days
export const arrWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

//Array of weekdays shortened form
export const arrDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']


//To show icon returned from open weather API
export const getIconSource = (iconCode) => {
    return `http://openweathermap.org/img/w/${iconCode}.png`
}

//Capitalize first letter for each word in a string
export const capitalizeFirstLetter = (string) => {
    let arrString = string.split(" ");
    for (var i = 0; i < arrString.length; i++) {
        arrString[i] = arrString[i].charAt(0).toUpperCase() + arrString[i].slice(1);

    }
    let strCurrentWeather = arrString.join(" ");
    return strCurrentWeather;
}