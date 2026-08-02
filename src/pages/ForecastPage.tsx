import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchWeather } from "../api/weather";
import type { WeatherForecast } from "../types";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: WeatherForecast };

const ForecastPage = () => {
  const { lat, lon } = useParams<{ lat: string; lon: string }>();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetchWeather(Number(lat), Number(lon))
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ status: "error", message: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return (
    <div className="min-h-screen max-w-xl mx-auto px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">US Weather Forecast</h1>
      </header>

      <main>
        <Link to="/" className="underline text-sm">
          ← Search another city
        </Link>

        <div className="mt-6">
          {state.status === "loading" && (
            <p data-testid="loading">Loading forecast…</p>
          )}

          {state.status === "error" && (
            <p data-testid="error" className="text-red-600">
              {state.message}
            </p>
          )}

          {state.status === "success" && <ForecastView data={state.data} />}
        </div>
      </main>
    </div>
  );
};

const ForecastView = ({ data }: { data: WeatherForecast }) => {
  const [current, ...upcoming] = data.periods;
  const locationName = data.relativeLocation
    ? `${data.relativeLocation.city}, ${data.relativeLocation.state}`
    : "Selected location";

  return (
    <div data-testid="forecast">
      <h2 data-testid="location-name" className="text-xl font-medium">
        {locationName}
      </h2>

      {current && (
        <div className="mt-3">
          <p data-testid="current-temp" className="text-3xl font-semibold">
            {current.temperature}°{current.temperatureUnit}
          </p>
          <p className="text-slate-600">{current.shortForecast}</p>
          {current.probabilityOfPrecipitation.value !== null && (
            <p className="text-slate-600">
              {current.probabilityOfPrecipitation.value}% chance of precip
            </p>
          )}
        </div>
      )}

      <section className="mt-6">
        <h3 className="font-medium mb-2">Upcoming</h3>
        {upcoming.length > 0 ? (
          <ul className="space-y-2">
            {upcoming.map((period) => (
              <li
                key={period.number}
                data-testid="forecast-period"
                className="border rounded px-3 py-2"
              >
                <p className="font-medium">{period.name}</p>
                <p>
                  {period.temperature}°{period.temperatureUnit}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">No upcoming periods available.</p>
        )}
      </section>
    </div>
  );
};

export default ForecastPage;
