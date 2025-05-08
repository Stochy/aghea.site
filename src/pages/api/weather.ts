import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  const apiKey = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=Brighton,GB&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      console.error("OpenWeatherMap error response:", data);
      return res.status(response.status).json({ error: "Weather API returned status " + response.status });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}

