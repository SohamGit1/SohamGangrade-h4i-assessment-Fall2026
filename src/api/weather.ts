import type {
  NwsForecastResponse,
  NwsPointsResponse,
  WeatherForecast,
} from "../types";

const NWS_BASE_URL = "https://api.weather.gov";

export const fetchWeatherByCoordinates = async (
  lat: number,
  lng: number
): Promise<WeatherForecast> => {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("That doesn't look like a valid set of coordinates.");
  }

  // NWS requires coordinates with at most 4 decimal places, or it redirects.
  const latParam = lat.toFixed(4);
  const lngParam = lng.toFixed(4);

  let pointsData: NwsPointsResponse;
  try {
    const pointsResponse = await fetch(
      `${NWS_BASE_URL}/points/${latParam},${lngParam}`
    );
    // Points lookup fails
    if (!pointsResponse.ok) {
      throw new Error(`Points lookup failed: ${pointsResponse.status}`);
    }
    pointsData = await pointsResponse.json();
  } catch {
    // Cannot find location
    throw new Error(
      "Couldn't find that location — the National Weather Service only covers US locations."
    );
  }

  // Get forecast url and properties from the point
  const forecastUrl = pointsData.properties?.forecast;
  const relativeLocationProps =
    pointsData.properties?.relativeLocation?.properties;

  let forecastData: NwsForecastResponse;
  try {
    if (!forecastUrl) {
      throw new Error("Points response did not include a forecast URL.");
    }
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error(`Forecast lookup failed: ${forecastResponse.status}`);
    }
    forecastData = await forecastResponse.json();
  } catch {
    throw new Error("Weather lookup failed (forecast). Please try again.");
  }

  // return city and state location for the coordinate
  return {
    relativeLocation: relativeLocationProps
      ? {
          city: relativeLocationProps.city,
          state: relativeLocationProps.state,
        }
      : null,
    periods: forecastData.properties?.periods ?? [],
  };
};

// Convenience alias so callers can use a shorter name.
export const fetchWeather = fetchWeatherByCoordinates;
