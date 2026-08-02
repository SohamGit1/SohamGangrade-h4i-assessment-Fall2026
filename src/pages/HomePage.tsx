import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCities } from "../api/geocoding";
import type { GeocodingResult } from "../types";

const DEBOUNCE_MS = 300;

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const navigate = useNavigate();
  const latestRequestId = useRef(0);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const requestId = ++latestRequestId.current;
    const timeoutId = setTimeout(() => {
      searchCities(query).then((results) => {
        // Ignore results from a stale, slower-resolving request.
        if (requestId === latestRequestId.current) {
          setSuggestions(results);
        }
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (city: GeocodingResult) => {
    navigate(`/forecast/${city.lat}/${city.lng}`);
  };

  return (
    <div className="min-h-screen max-w-xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">US Weather Forecast</h1>
        <p className="text-slate-600">
          Search for a US city to see its National Weather Service forecast.
        </p>
      </header>

      <main>
        <label htmlFor="city-search" className="block mb-1 text-sm">
          City
        </label>
        <input
          id="city-search"
          data-testid="city-search-input"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a city, e.g. College Park"
          className="w-full border rounded px-3 py-2"
        />

        {suggestions.length > 0 && (
          <ul
            data-testid="city-suggestions"
            className="mt-2 border rounded divide-y"
          >
            {suggestions.map((city) => (
              <li key={`${city.lat},${city.lng}`}>
                <button
                  type="button"
                  data-testid="city-suggestion"
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100"
                >
                  {city.displayName}
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-sm text-slate-500">
          Try searching for a city like "College Park" or "Austin".
        </p>
      </main>

      <footer className="mt-10 text-sm">
        <a
          href="https://www.weather.gov/documentation/services-web-api"
          className="underline"
        >
          National Weather Service API
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
