import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

type WeatherResponse = {
  main: {
    temp: number;
  };
  weather: Array<{ main: string; description: string }>;
  name: string;
};

const names: Record<string, string> = {
  Clear: 'Sunny',
  Clouds: 'Cloudy',
  Rain: 'Rain',
  Drizzle: 'Drizzling',
  Thunderstorm: 'Lightning',
  Snow: 'Snowing',
  Mist: 'Light Mist',
  Smoke: 'Smoky',
  Haze: 'Smoke Fog',
  Dust: 'Dust',
  Fog: 'Thick Fog',
  Sand: 'Sandy',
  Ash: 'Ash',
  Squall: 'Angin Kencang',
  Tornado: 'Puting Beliung',
};

const icons: Record<string, string> = {
  Clear: 'typcn:weather-sunny',
  Clouds: 'typcn:weather-partly-sunny',
  Rain: 'ion:rainy',
  Drizzle: 'mdi:weather-rainy-light',
  Thunderstorm: 'mdi:weather-lightning',
  Snow: 'mdi:weather-snowy',
  Mist: 'mdi:weather-fog',
  Smoke: 'mdi:weather-smoke',
  Haze: 'mdi:weather-hazy',
  Dust: 'mdi:weather-dust',
  Fog: 'mdi:weather-fog',
  Sand: 'mdi:weather-sandstorm',
  Ash: 'mdi:weather-dust',
  Squall: 'mdi:weather-windy',
  Tornado: 'mdi:weather-tornado',
};

const Weather: React.FC<{ onlyCity?: boolean }> = ({ onlyCity = false }) => {
  const [data, setData] = useState<WeatherResponse | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then((res) => res.json())
      .then((res: any) => {
        console.log('Weather API response:', res); // Debugging log
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching weather data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading weather data...</p>;
  }

  if (
    !data ||
    !data.main ||
    !data.weather ||
    data.weather.length === 0 ||
    typeof data.main.temp !== 'number'
  ) {
    return <p>Weather data is not available.</p>;
  }

  if (onlyCity) {
    return (
      <p className="mt-2 flex text-sm gap-2 items-center">
        <Icon icon="mdi:globe" className="w-5 h-5" />
        <span>{data.name}</span>
      </p>
    );
  }

  const tempCelsius = data.main.temp; // ✅ Assumes API gives Celsius directly
  const weatherMain = data.weather[0]?.main || '';
  const weatherIcon = icons[weatherMain] || 'mdi:weather-partly-cloudy';

  return (
    <p className="mt-2 flex text-sm gap-2 items-center">
      <Icon icon={weatherIcon} className="w-5 h-5" />
      <span>
        {tempCelsius.toFixed(0)}°C {names[weatherMain] ?? weatherMain}
      </span>
    </p>
  );
};

export default Weather;
