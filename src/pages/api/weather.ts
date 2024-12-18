import { NextApiRequest, NextApiResponse } from 'next';

type WeatherResponse = {
  main: {
    temp: number;
  };
  weather: Array<{ description: string }>;
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Make a request to OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=-7.795580&lon=110.369492&units=imperial&appid=${process.env.WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: WeatherResponse = await response.json();

    // Set Cache-Control header for caching the API response
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    
    // Return the weather data as JSON
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Return an error response
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}