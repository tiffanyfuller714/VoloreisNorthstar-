import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const GEOFENCE_RADIUS_KM = 50;

/**
 * Approximate a circle as a GeoJSON Polygon around the given centre point.
 */
function makeCirclePolygon(lng, lat, radiusKm, steps = 64) {
  const coords = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    // degrees per km, accounting for latitude compression on the x-axis
    const dx = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
    const dy = radiusKm / 110.574;
    coords.push([lng + dx * Math.cos(angle), lat + dy * Math.sin(angle)]);
  }
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
    properties: {},
  };
}

/**
 * TravelerMap – shows the traveler's live GPS position on a Mapbox map and
 * draws a 50 km geofence circle around their destination.
 *
 * Props:
 *   position    – { lat, lng, accuracy } – updated as GPS reports new fixes
 *   destination – string trip destination used to geocode the geofence centre
 */
export default function TravelerMap({ position, destination }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialise the map once on mount; geocode the destination for the geofence.
  // The geofence is intentionally rendered only at mount time because a
  // traveler's destination does not change during an active trip session.
  useEffect(() => {
    if (!containerRef.current) return;

    const accessToken =
      (typeof window !== "undefined" && window.__MAPBOX_TOKEN) || "";
    if (!accessToken) return;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 20],
      zoom: 1.6,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    map.on("load", async () => {
      if (!destination) return;
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            destination
          )}.json?access_token=${accessToken}&limit=1`
        );
        const data = await res.json();
        const feat = data?.features?.[0];
        if (!feat) return;

        const [dLng, dLat] = feat.center;

        // Destination marker (green)
        new mapboxgl.Marker({ color: "#00aa44" })
          .setLngLat([dLng, dLat])
          .setPopup(
            new mapboxgl.Popup({ offset: 24 }).setText(
              `Destination: ${destination}`
            )
          )
          .addTo(map);

        // Geofence fill + outline
        const circle = makeCirclePolygon(dLng, dLat, GEOFENCE_RADIUS_KM);
        map.addSource("geofence", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [circle] },
        });
        map.addLayer({
          id: "geofence-fill",
          type: "fill",
          source: "geofence",
          paint: { "fill-color": "#00aa44", "fill-opacity": 0.12 },
        });
        map.addLayer({
          id: "geofence-outline",
          type: "line",
          source: "geofence",
          paint: {
            "line-color": "#00aa44",
            "line-width": 2,
            "line-opacity": 0.65,
          },
        });
      } catch {
        // Geocoding is best-effort; failure is silent.
      }
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Move / create the traveler's position marker whenever GPS updates.
  useEffect(() => {
    if (!mapRef.current || !position) return;

    if (markerRef.current) {
      markerRef.current.setLngLat([position.lng, position.lat]);
    } else {
      markerRef.current = new mapboxgl.Marker({ color: "#1b8ef2" })
        .setLngLat([position.lng, position.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 24 }).setText("Your current location")
        )
        .addTo(mapRef.current);
    }

    const flyTo = () =>
      mapRef.current?.flyTo({ center: [position.lng, position.lat], zoom: 9 });

    if (mapRef.current.isStyleLoaded()) {
      flyTo();
    } else {
      mapRef.current.once("load", flyTo);
    }
  }, [position]);

  return (
    <div
      ref={containerRef}
      style={{
        height: 320,
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        marginTop: 12,
      }}
    />
  );
}
