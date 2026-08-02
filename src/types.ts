// ---------------------------------------------------------------------------
// Geocoding (Photon API) — used to turn a city name into coordinates.
// ---------------------------------------------------------------------------
export interface GeocodingResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  state?: string;
  country?: string;
}

// ---------------------------------------------------------------------------
// Weather (National Weather Service API) — used to turn coordinates into a
// forecast. See https://www.weather.gov/documentation/services-web-api
// ---------------------------------------------------------------------------
export interface NwsPointsResponse {
  properties: {
    forecast: string;
    relativeLocation?: {
      properties: {
        city: string;
        state: string;
      };
    };
  };
}

export interface NwsForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number | null;
  };
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface NwsForecastResponse {
  properties: {
    periods: NwsForecastPeriod[];
  };
}

export interface RelativeLocation {
  city: string;
  state: string;
}

export interface WeatherForecast {
  relativeLocation: RelativeLocation | null;
  periods: NwsForecastPeriod[];
}
