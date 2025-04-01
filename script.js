const userlocation = document.getElementById("userlocation");
converter = document.getElementById("converter");
weatherIcon = document.querySelector(".weatherIcon");
temperature = document.querySelector(".temperature");
feelsLike = document.querySelector(".feelsLike");
description = document.querySelector(".description");
date = document.querySelector(".date");
city = document.querySelector(".city");
Hvalue = document.querySelector("#Hvalue");
Wvalue = document.querySelector("#Wvalue");
SRvalue = document.querySelector("#SRvalue");
SSvalue = document.querySelector("#SSvalue");
Cvalue = document.querySelector("#Cvalue");
UVvalue = document.querySelector("#UVvalue");
Pvalue = document.querySelector("#Pvalue");
Forcaste = document.querySelector(".Forcaste");
WEATHER_API_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/weather?appid=76ad2c40d811de09152718de4ce873ba&q=";
WEATHER_DATA_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/forecast?appid=76ad2c40d811de09152718de4ce873ba&days=7&units=metric&q=";

function findUserLocation() {
  Forcaste.innerHTML = "";
  fetch(WEATHER_API_ENDPOINT + userlocation.value)
    .then((Response) => Response.json())
    .then((data) => {
      if (data.cod != "" && data.cod != 200) {
        alert(data.message);
        return;
      }
      console.log(data);
      city.innerHTML = data.name + "," + data.sys.country;
      weatherIcon.style.background = `Url("https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png")`;
    
      description.innerHTML =
        `<i class="fa-brands fa-cloudversify"></i> &nbsp` +
        data.weather[0].description;

      Hvalue.innerHTML = data.main.humidity + "<span>%</span>";
      Wvalue.innerHTML = data.wind.speed + "<span>m/s</span>";
      const option1 = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      SRvalue.innerHTML = getLongFormateDateTime(
        data.sys.sunrise,
        data.timezone,
        option1
      );

      SSvalue.innerHTML = getLongFormateDateTime(
        data.sys.sunset,
        data.timezone,
        option1
      );
      const option = {
        weekday: "long",
        month: "long",
        year: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      date.innerHTML = getLongFormateDateTime(data.dt, data.timezone, option);

      Cvalue.innerHTML = Math.round(data.clouds.all) + "<span>%</span>";
      Pvalue.innerHTML =
        Math.round(data.main.pressure) + "&nbsp<span>hPa</span>";

      fetch(WEATHER_DATA_ENDPOINT + `${data.name}`)
        .then((Response) => Response.json())
        .then((data2) => {
          console.log(data2)
          temperature.innerHTML = temConverter(Math.round(data2.list[0].main.temp));
          feelsLike.innerHTML =
            "Feels like " + temConverter(Math.round(data2.list[0].main.feels_like));
            Forcaste.innerHTML = "";
          console.log(data2.list);
          for (let i = 0; i < data2.list.length; i += 8) {
            let weather = data2.list[i]; // Access each item in the array
            let div = document.createElement("div");

            const options = {
              weekday: "long",
              month: "long",
              day: "numeric",
            };
            let daily = getLongFormateDateTime(weather.dt, 0, options).split(
              "at"
            );

            div.innerHTML = daily[0];
            div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"></img>`;
            div.innerHTML += `<p class="Forcaste-description">${weather.weather[0].description}</p>`;
            div.innerHTML+=`<span><span> min temp. ${ temConverter(weather.main.temp_min)}</span></span>`
            div.innerHTML+=`<span><span> max temp. ${ temConverter(weather.main.temp_max)}</span></span>`

            Forcaste.append(div);
          }
        });
    });
}
function formatUNIXTime(dtValue, offSet, options = {}) {
  const date = new Date((dtValue + offSet) * 1000);
  return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}
function getLongFormateDateTime(dtValue, offSet, options) {
  return formatUNIXTime(dtValue, offSet, options);
}
function temConverter(temp) {
  let tempValue = Math.round(temp);
  let message = "";
  if (converter.value == "°C") {
    message = tempValue + "<span>" + "\xB0C</span>";
  } else {
    let ctof = (tempValue * 9) / 5 + 32;
    message = ctof + "<span>" + "\xB0F</span>";
  }
  return message;
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
