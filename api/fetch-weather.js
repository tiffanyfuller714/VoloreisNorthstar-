function mapWeatherCode(code) {
  if (code === 0) return "clear";
  if ([1, 2, 3].includes(code)) return "clouds";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([80, 81, 82].includes(code)) return "showers";
  if ([95, 96, 99].includes(code)) return "thunder";
  return "clouds";
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const destination = String(body.destination || "").trim();
    if (!destination) {
      res.status(400).json({ error: "Missing destination" });
      return;
    }

    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.searchParams.set("name", destination);
    geoUrl.searchParams.set("count", "1");
    geoUrl.searchParams.set("language", "en");

    const geoRes = await fetch(geoUrl.toString());
    if (!geoRes.ok) {
      const text = await geoRes.text();
      throw new Error(`Geocoding failed: ${geoRes.status} ${text}`);
    }
    const geo = await geoRes.json();
    const place = geo.results?.[0];
    if (!place) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
    forecastUrl.searchParams.set("latitude", String(place.latitude));
    forecastUrl.searchParams.set("longitude", String(place.longitude));
    forecastUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m");
    forecastUrl.searchParams.set("timezone", "auto");

    const weatherRes = await fetch(forecastUrl.toString());
    if (!weatherRes.ok) {
      const text = await weatherRes.text();
      throw new Error(`Weather fetch failed: ${weatherRes.status} ${text}`);
    }
    const weather = await weatherRes.json();

    const current = weather.current || {};
    const result = {
      location: place.name,
      region: place.country,
      local_time: weather.current?.time || null,
      temperature_c: current.temperature_2m ?? null,
      humidity: current.relative_humidity_2m ?? null,
      wind_kph: current.wind_speed_10m ?? null,
      condition: mapWeatherCode(current.weather_code),
      weather_code: current.weather_code ?? null,
    };

    res.json({ success: true, weather: result });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Fetch weather error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};
