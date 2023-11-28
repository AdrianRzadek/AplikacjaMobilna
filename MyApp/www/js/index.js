document.addEventListener("deviceready", onDeviceReady, false);

// Declare a global object to store geolocation data
let geolocationData = {};

// Define a function to get geolocation data as a Promise
function getGeolocationData() {
  return new Promise((resolve, reject) => {
    // Define the success callback function
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

      // Resolve the Promise with geolocationData
      resolve(geolocationData);
    };

    // Define the error callback function
    const onError = function (error) {
      reject(error);
    };

    // Get the current geolocation position
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  });
}

// Function to store data in localStorage
function storeDataInLocalStorage(routes, routeId) {
  localStorage.setItem("routes", JSON.stringify(routes));
  localStorage.setItem("routeId", JSON.stringify(routeId));

  const selectedRoute = routes.find((route) => route.hasOwnProperty(routeId));

  if (selectedRoute) {
    localStorage.setItem("selectedRoute", JSON.stringify(selectedRoute));
  } else {
    console.error("Selected route not found");
  }

  const pointsArray = selectedRoute ? selectedRoute[routeId] : null;

  localStorage.setItem("pointsArray", JSON.stringify(pointsArray));

  console.log(`Response from points array for route ${routeId}:`, pointsArray);
}

// Function to create map, marker, and routing control
function createMapAndRoutingControl(map, waypoints) {
  L.marker([geolocationData.latitude, geolocationData.longitude])
    .addTo(map)
    .bindPopup("Jesteś tutaj")
    .openPopup();

  const routingControl = L.Routing.control({
    waypoints: waypoints,
  }).addTo(map);

  return routingControl;
}

// Wait for geolocation data and then proceed
getGeolocationData().then((data) => {
  const x = data.latitude;
  const y = data.longitude;

  const map = L.map("map").setView([x, y], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const buttons = document.querySelectorAll("button");

  let routeOldId;
  let routingControl;

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      console.log("Button clicked. Current value:", button.value);

      // Fetch data from the API
      try {
        const response = await fetch("http://localhost:3000/api/v1/points");

        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }

        const data = await response.json();
        const routes = data.data;
        const routeId = button.value;

        storeDataInLocalStorage(routes, routeId);

        const storedRouteId = JSON.parse(localStorage.getItem("routeId"));
        const storedPointsArray = JSON.parse(localStorage.getItem("pointsArray"));

        const waypoints = storedPointsArray.map((point) => L.latLng(point.x, point.y));
        waypoints.unshift(L.latLng(x, y));

        // Remove existing layers and routing container
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        const routingContainer = document.querySelector(".leaflet-routing-container");
        if (routingContainer) {
          routingContainer.parentNode.removeChild(routingContainer);
        }

        // Create map, marker, and routing control
        routingControl = createMapAndRoutingControl(map, waypoints);

        // Additional logic for checking if routeId has changed
        if (routeOldId !== storedRouteId) {
          console.log("Value changed from", routeOldId, "to", storedRouteId);
        }

        // Update routeOldId
        routeOldId = storedRouteId;
      } catch (error) {
        console.error(error);
      }
    });
  });
});

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}
