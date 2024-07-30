let currentMetric = "metric";
function dateToDay(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

function processData(data) {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hours}:${minutes}`;

  const processedData = {
    currentCondition: data.currentConditions.conditions,
    city: data.address,
    time: currentTime,
    day: dateToDay(new Date()),
    temp: data.currentConditions.temp,
    feelsLike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    chanceOfRain: data.currentConditions.precipprob,
    windSpeed: data.currentConditions.windspeed,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
    minTemp: data.days[0].tempmin,
    maxTemp: data.days[0].tempmax,
    description: data.description,
    hours: data.days[0].hours,
  };

  return processedData;
}

function processDailyData(data) {
  const processedData = {
    dayName: dateToDay(new Date(data.datetime)),
    minTemp: data.tempmin,
    maxTemp: data.tempmax,
    temp: data.temp,
    feelsLike: data.feelslike,
  };

  return processedData;
}
async function getWeatherData(metric = "metric") {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/tokyo?unitGroup=${metric}&key=PEMYDAUJ7DTAG9KNEWKLR4DX5&contentType=json`,
      { mode: "cors" }
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
function displaymain(data) {
  const processedData = processData(data);
  const mainDiv = document.querySelector(".main");
  mainDiv.innerHTML = "";

  const city = document.createElement("p");
  city.textContent =
    processedData.city.charAt(0).toUpperCase() + processedData.city.slice(1);
  mainDiv.appendChild(city);

  const currentTemperature = document.createElement("p");
  currentTemperature.textContent = `${processedData.temp}${
    currentMetric === "metric" ? "°C" : "°F"
  }`;
  mainDiv.appendChild(currentTemperature);

  const condition = document.createElement("h3");
  condition.textContent = processedData.currentCondition;
  mainDiv.appendChild(condition);

  const fromTo = document.createElement("p");
  fromTo.textContent = `From ${processedData.minTemp}${
    currentMetric === "metric" ? "°C" : "°F"
  } to ${processedData.maxTemp}${currentMetric === "metric" ? "°C" : "°F"}`;
  mainDiv.appendChild(fromTo);

  const changeMetric = document.createElement("button");
  changeMetric.textContent = `Change to ${
    currentMetric === "metric" ? "°F" : "°C"
  }`;
  changeMetric.addEventListener("click", async () => {
    if (currentMetric === "metric") {
      currentMetric = "us";
    } else {
      currentMetric = "metric";
    }

    const newData = await getWeatherData(currentMetric);
    displaySite(newData);
  });

  mainDiv.appendChild(changeMetric);
}

function rigthElement(icon, title, value) {
  const details = document.querySelector(".details");
  const element = document.createElement("div");

  const text = document.createElement("div");

  const titleElement = document.createElement("p");
  titleElement.textContent = title;

  const valueElement = document.createElement("p");
  valueElement.textContent = value;

  const iconElement = document.createElement("i");
  iconElement.classList.add("fas", icon);

  text.appendChild(titleElement);
  text.appendChild(valueElement);
  element.appendChild(iconElement);
  element.appendChild(text);

  details.appendChild(element);
}

function displaydetails(data) {
  const details = document.querySelector(".details");
  details.innerHTML = "";
  const processedData = processData(data);
  rigthElement(
    "fa-temperature-high",
    "Feels like",
    `${processedData.feelsLike} ${currentMetric === "metric" ? "°C" : "°F"}`
  );
  rigthElement("fa-tint", "Humidity", `${processedData.humidity}%`);
  rigthElement(
    "fa-cloud-showers-heavy",
    "Chance of rain",
    `${processedData.chanceOfRain}%`
  );
  rigthElement(
    "fa-wind",
    "Wind speed",
    `${processedData.windSpeed} ${currentMetric === "metric" ? "km/h" : "mph"}`
  );
}

function dayDiv(dayName, temp, minTemp, icon) {
  const day = document.createElement("div");
  day.classList.add("day");
  const dayNameElement = document.createElement("h3");
  dayNameElement.textContent = dayName;
  day.appendChild(dayNameElement);
  const dayTemperature = document.createElement("p");
  dayTemperature.textContent = `${temp}${
    currentMetric === "metric" ? "°C" : "°F"
  }`;
  day.appendChild(dayTemperature);

  const dayMinTemperature = document.createElement("p");
  dayMinTemperature.textContent = `${minTemp}${
    currentMetric === "metric" ? "°C" : "°F"
  }`;
  day.appendChild(dayMinTemperature);
  const dayIcon = document.createElement("i");
  dayIcon.classList.add("fas", icon);
  day.appendChild(dayIcon);

  return day;
}

function displayDaily(data) {
  const botList = document.querySelector("#bot-list");
  botList.innerHTML = "";
  const { days } = data;
  const slicedDays = days.slice(1, 7);

  const processedDays = slicedDays.map((day) => processDailyData(day));
  processedDays.forEach((day) => {
    const dayElement = dayDiv(day.dayName, day.temp, day.minTemp, day.icon);
    botList.appendChild(dayElement);
  });
}

function displayForecast(data) {
  const processedData = processData(data);
  const forecast = document.querySelector(".forecast");
  forecast.innerHTML = "";
  const title = document.createElement("p");
  title.textContent = processedData.description;
  const currentHour = new Date().getHours().toLocaleString();
  const hours = processedData.hours.filter((hour) => {
    const hourNumber = Number(hour.datetime.split(":")[0]);
    return hourNumber >= currentHour;
  });
  hours.forEach((hour, index) => {
    const hourDiv = document.createElement("div");
    hourDiv.classlist = "hour-div";

    const hourName = document.createElement("p");
    if (index === 0) {
      hourName.textContent = "Now";
    } else {
      hourName.textContent = hour.datetime;
    }

    hourDiv.appendChild(hourName);

    const icon = document.createElement("img");
    hourDiv.appendChild(icon);

    const temp = document.createElement("p");
    temp.textContent = hour.temp;
    hourDiv.appendChild(temp);

    forecast.appendChild(hourDiv);
  });
}

function displaySite(data) {
  displaymain(data);
  displaydetails(data);
  displayDaily(data);
  displayForecast(data);
}

async function main() {
  const data = await getWeatherData();
  displaySite(data);
}

main();
