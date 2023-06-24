const timeE1 = document.getElementById('time');
const dateE1 =document.getElementById('date');
const currentweatherItemsE1 = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryE1 = document.getElementById('country');
const weatherForecastE1 = document.getElementById('weather-forecast');
const currentTempE1 = document.getElementById('current-temp');
const days = ['sunday', 'Monday', 'Tuesday','Wednesday','Thursday','Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct', 'Nov', 'Dec'];
const API_KEY ='226db6ca10875d7742c5f784b803ed1d';
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >=13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeE1.innerHTML = hoursIn12HrFormat + ':' + minutes+ '' + `<span class="am-pm" id="am-pm">${ampm}</span>`
    dateE1.innerHTML = days[day] + ',' + date+ '' + months[month]

}, 1000);
getWeatherData()
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) => {
         console.log(success);
         let {latitude, longitude} = success.coords;
         
         fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{
             console.log(data);
             showWeatherData(data);
         })

    })
    
}
function showWeatherData(data){
let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
currentweatherItemsE1.innerHTML=
     `<div class="weather-item">
         <div>Humidity</div>
         <div>${humidity}</div>
       </div>
       
       <div class="weather-item">
         <div>Pressure</div>
         <div>${pressure}</div>
        </div>

        <div class="weather-item">
          <div>WindSpeed</div>
          <div>${wind_speed}</div> 
       </div>
       <div class="weather-item">
       <div>Sunrise</div>
       <div>${window.moment(sunrise *1000).format('HH:mm a')}</div>
      </div>
      <div class="weather-item">
      <div>Sunset</div>
      <div>${window.moment(sunset *1000).format('HH:mm a')}</div>
     </div>
    
     `;
       let otherDayForcast = ''
     data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempE1.innerHTML =`
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="Weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">DAy - ${day.temp.day}&#176;C</div>
            </div>
            
            `

        }
        else{
           otherDayForcast += `
           <div class="weather-forecast-item">
              <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
              <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon" class="w-icon">
              <div class="temp">Night - ${day.temp.night}&#176;C</div>
              <div class="temp">DAy - ${day.temp.day}&#176;C</div>
          </div>
           `
        }
        
    })
    weatherForecastE1.innerHTML = otherDayForcast;         
}
const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ 
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; 
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
