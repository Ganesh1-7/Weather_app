const cityInput=document.querySelector(".city-input");
const searchbtn=document.querySelector(".search-btn");

const notFound = document.querySelector(".not-found");
const searhCity = document.querySelector(".search-city");
const weatherinfo = document.querySelector(".weather-info");

const countrytxt = document.querySelector(".coutry-text");
const temptxt = document.querySelector(".temp-text");
const conditiontxt = document.querySelector(".condition-text");
const humidityval = document.querySelector(".humidity-value-txt");
const windval = document.querySelector(".wind-value-txt");
const weathersummaryimg = document.querySelector(".weather-summary-image");
const currentDate = document.querySelector(".current-date-text");

const forecastItemContainer = document.querySelector(".forecast-item-container");
const a=cityInput.value;

searchbtn.addEventListener("click",()=>{
    if(cityInput.value.trim() != ''){
        updateWeather(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
});

cityInput.addEventListener("keydown",(event)=>{
    if(event.key=='Enter'&& cityInput.value.trim() !=''){
        updateWeather(cityInput.value);
        cityInput.value='';    
        cityInput.blur();
    }
});

async function getData(endpoint,city){
    const apikey= '6f205fc8175ed3cfad5e8fb8d063479f';
    const apiurl=`https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
    const response= await fetch(apiurl);
    return response.json();
}

function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg';
    if(id<=321) return 'drizzle.svg';
    if(id<=531) return 'rain.svg';
    if(id<=622) return 'snow.svg';
    if(id<=781) return 'atmosphere.svg';
    if(id<=800) return 'clear.svg';
    else return 'clouds.svg';
}
function getCurrentDate(){
    const date=new Date();
    const options= {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return date.toLocaleDateString('en-GB',options)
}

async function updateWeather(city){
    const data= await getData('weather',city);
    if(data.cod !=200){
        showDisplaySection(notFound);

        return
    }
    console.log(data);
    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    }=data;

    countrytxt.textContent=country;
    temptxt.textContent=temp + " °C";
    conditiontxt.textContent=main;
    humidityval.textContent=humidity + "%";
    windval.textContent=speed + " M/s";

    currentDate.textContent=getCurrentDate();
    weathersummaryimg.src= `assets/weather/${getWeatherIcon(id)}`
    
    showDisplaySection(weatherinfo);
    await upDateWeatherForeCastInfo(city);
}
    
async function upDateWeatherForeCastInfo(city){
    const foreCastData = await getData('forecast',city);

    const timeTaken= '12:00:00';
    const todayDate= new Date().toISOString().split('T')[0];
    forecastItemContainer.innerHTML=''
    console.log(foreCastData.list)
    foreCastData.list.forEach(forecastWeather=>{
        if(forecastWeather.dt_txt.includes(timeTaken)&&
    !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather);
        }
    })
}
 
function updateForecastItems(WeatherData){
    const {
        dt_txt: date,
        weather: [{id}],
        main: { temp }
    }=WeatherData;

    const dateTaken=new Date(date);
    const DateOption= {
        day: '2-digit',
        month: 'short'
    }
    const dateResult=dateTaken.toLocaleDateString('en-US',DateOption)

    const forecastitem=` 
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>`
        
        forecastItemContainer.insertAdjacentHTML('beforeend', forecastitem);
    }

function showDisplaySection(section){
    [weatherinfo, searhCity, notFound]
        .forEach(section=>section.style.display = 'none');
    section.style.display = 'flex';
}