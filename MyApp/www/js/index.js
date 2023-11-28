document.addEventListener("deviceready", onDeviceReady, false);

let geolocationData = {};

function getGeolocationData() {
  return new Promise((resolve, reject) => {
    const onSuccess = function (position) {
      geolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };
      resolve(geolocationData);
    };

    const onError = function (error) {
      reject(error);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  });
}

function createMap(x, y) {
  const map = L.map("map").setView([x, y], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  return map;
}

function createRoutingControl(map, waypoints) {
  const routingControl = L.Routing.control({
    waypoints: waypoints,
  }).addTo(map);

  return routingControl;
}

function clearMapLayers(map) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  const routingContainer = document.querySelector('.leaflet-routing-container');
  if (routingContainer) {
    routingContainer.parentNode.removeChild(routingContainer);
  }
}

function onButtonClick(button, x, y, map, routeOldId) {
  button.addEventListener("click", function () {
    console.log('Button clicked. Current value:', button.value);

    fetch(`http://localhost:3000/api/v1/points`)
      .then((response) => response.json())
      .then((data) => {
        const routes = data.data;
        const routeId = button.value;
        const selectedRoute = routes.find((route) => route.hasOwnProperty(routeId));

        if (selectedRoute) {
          const pointsArray = selectedRoute[routeId];
          console.log(`Response from points array for route ${routeId}:`, pointsArray);

          const waypoints = pointsArray.map((point) => L.latLng(point.x, point.y));
          waypoints.unshift(L.latLng(x, y));

          clearMapLayers(map);

          L.marker([x, y]).addTo(map).bindPopup("Jesteś tutaj").openPopup();
          const routingControl = createRoutingControl(map, waypoints);

          if (routeOldId !== routeId) {
            console.log('Value changed from', routeOldId, 'to', routeId);
          }

          routeOldId = routeId;
        }
      })
      .catch((error) => {
        console.error("Error getting geolocation data:", error.message);
      });
  });
}

getGeolocationData().then((data) => {
  const x = data.latitude;
  const y = data.longitude;

  const map = createMap(x, y);

  const buttons = document.querySelectorAll('button');
  let routeOldId;

  buttons.forEach((button) => {
    onButtonClick(button, x, y, map, routeOldId);
  });
});

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}
