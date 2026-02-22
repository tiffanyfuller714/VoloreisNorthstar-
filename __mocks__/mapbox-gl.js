// Jest manual mock for mapbox-gl.
// Provides no-op stubs so that components importing mapbox-gl can be
// rendered in the JSDOM test environment without requiring a real WebGL
// context or the TextDecoder global that mapbox-gl v3 needs at import time.

class MockMap {
  constructor() {}
  addControl() {}
  on() {}
  once() {}
  remove() {}
  addSource() {}
  addLayer() {}
  flyTo() {}
  setCenter() {}
  setZoom() {}
  isStyleLoaded() { return true; }
}

class MockMarker {
  constructor() {}
  setLngLat() { return this; }
  setPopup() { return this; }
  addTo() { return this; }
  remove() {}
  getLngLat() { return { lat: 0, lng: 0 }; }
}

class MockPopup {
  constructor() {}
  setText() { return this; }
  setHTML() { return this; }
}

class MockNavigationControl {}

const mapboxgl = {
  Map: MockMap,
  Marker: MockMarker,
  Popup: MockPopup,
  NavigationControl: MockNavigationControl,
  accessToken: "",
};

module.exports = mapboxgl;
