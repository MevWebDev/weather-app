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
  };

  return processedData;
}

function processDailyData(data) {
  const processedData = {
    dayName: dateToDay(new Date(data.datetime)),
    temp: data.temp,
    feelsLike: data.feelslike,
  };
  return processedData;
}
async function getWeatherData(metric = "metric") {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/gdansk?unitGroup=${metric}&key=PEMYDAUJ7DTAG9KNEWKLR4DX5&contentType=json`,
      { mode: "cors" }
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
function displayLeft(data) {
  const processedData = processData(data);
  const left = document.querySelector(".left");
  left.innerHTML = "";

  const condition = document.createElement("h3");
  condition.textContent = processedData.currentCondition;
  left.appendChild(condition);

  const city = document.createElement("p");
  city.textContent =
    processedData.city.charAt(0).toUpperCase() + processedData.city.slice(1);
  left.appendChild(city);

  const time = document.createElement("p");
  time.textContent = `${processedData.day} ${processedData.time}`;
  left.appendChild(time);

  const currentTemperature = document.createElement("p");
  currentTemperature.textContent = `${processedData.temp}${
    currentMetric === "metric" ? "°C" : "°F"
  }`;
  left.appendChild(currentTemperature);

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
    console.log(`currentMetric: ${currentMetric}`);
    const newData = await getWeatherData(currentMetric);
    displaySite(newData);
  });

  left.appendChild(changeMetric);
}

function rigthElement(icon, title, value) {
  const right = document.querySelector(".right");
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

  right.appendChild(element);
}

function displayRight(data) {
  const right = document.querySelector(".right");
  right.innerHTML = "";
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

function dayDiv(dayName, temp, icon) {
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
    const dayElement = dayDiv(day.dayName, day.temp, day.icon);
    botList.appendChild(dayElement);
  });
}

function displaySite(data) {
  displayLeft(data);
  displayRight(data);
  displayDaily(data);
}

async function main() {
  const data = await getWeatherData();
  displaySite(data);
}

main();
