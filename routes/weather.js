const express = require('express');
const router = express.Router();
const request = require('request');     // Lab 9 requirement

// GET /weather show weather form
router.get('/weather', (req, res) => {
  res.render('weather.ejs', { weather: null, error: null });
});

// GET /weather/now?city=London
router.get('/weather/now', (req, res, next) => {
  let city = req.query.city || 'London';
  let apiKey = process.env.WEATHER_API_KEY;    // storing key safely!
  
  if (!apiKey) return res.send("Missing API key. Add WEATHER_API_KEY to .env");

  let url =
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if (err) return next(err);

    let weather = {};

    try {
      weather = JSON.parse(body);
    } catch (e) {
      return res.send("API returned invalid JSON");
    }

    // error handling when city not found
    if (!weather || !weather.main) {
      return res.render('weather.ejs', {
        weather: null,
        error: "No data found for that city."
      });
    }

    // human friendly message
    let wmsg = `
      <h2>Weather in ${weather.name}</h2>
      <p>Temperature: ${weather.main.temp}°C</p>
      <p>Humidity: ${weather.main.humidity}%</p>
      <p>Wind speed: ${weather.wind.speed} m/s</p>
    `;

    res.render('weather.ejs', {
      weather: wmsg,
      error: null
    });
  });
});

module.exports = router;
