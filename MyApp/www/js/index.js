document.addEventListener("deviceready", onDeviceReady, false);

function getGeolocationData() {
  return new Promise((resolve, reject) => {
    const onSuccess = function (position) {
      const geolocationData = {
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

function getWaypoints() {
  const storedWaypoints = localStorage.getItem('waypoints');
  return storedWaypoints ? JSON.parse(storedWaypoints) : null;
}

function setWaypoints(waypoints) {
  localStorage.setItem('waypoints', JSON.stringify(waypoints));
}

function createMap(x, y) {
  const map = L.map("map").setView([x, y], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add the marker for the current location
  L.marker([x, y]).addTo(map).bindPopup("Jesteś tutaj").openPopup();

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

    // Attempt to fetch data from the API
    fetch(`http://localhost:3000/api/v1/points`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const routes = data.data;
        const routeId = button.value;
        const selectedRoute = routes.find((route) => route.hasOwnProperty(routeId));

        if (selectedRoute) {
          const pointsArray = selectedRoute[routeId];
          console.log(`Response from points array for route ${routeId}:`, pointsArray);

          // Create an array of waypoints with descriptions and image paths
          const waypoints = pointsArray.map((point) => ({
            latLng: L.latLng(point.x, point.y),
            description: point.description || 'No description available',
            imagePath: point.imagePath || './img/logo.png', // Use a default image if imagePath is not provided
          }));
          waypoints.unshift({ latLng: L.latLng(x, y), description: 'Jesteś tutaj', imagePath: './img/logo.png' });

          // Store waypoints in local storage
          setWaypoints(waypoints);

          clearMapLayers(map);

          // Add markers for each waypoint with descriptions and images
          waypoints.forEach((waypoint) => {
            const marker = L.marker(waypoint.latLng).addTo(map);

            // Use bindTooltip to add a tooltip to the marker
            marker.bindTooltip(waypoint.description, { permanent: false, interactive: true })
              .openTooltip();

            // Use bindPopup to add a popup to the marker (optional)
            marker.bindPopup(waypoint.description).openPopup();

            // Add the image to the marker
            const icon = L.icon({
              iconUrl: waypoint.imagePath,
              iconSize: [32, 32], // adjust the size as needed
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
            });

            marker.setIcon(icon);
          });

          const routingControl = createRoutingControl(map, waypoints.map((w) => w.latLng));

          if (routeOldId !== routeId) {
            console.log('Value changed from', routeOldId, 'to', routeId);
          }

          routeOldId = routeId;
        }
      })
      .catch((error) => {
        console.error("Error getting data from the API:", error.message);

        // Attempt to use stored waypoints from local storage
        const storedWaypoints = getWaypoints();
        if (storedWaypoints) {
          console.log('Using waypoints from local storage:', storedWaypoints);

          clearMapLayers(map);

          // Add markers for each stored waypoint with descriptions and images
          storedWaypoints.forEach((waypoint) => {
            const marker = L.marker(waypoint.latLng).addTo(map);

            // Use bindTooltip to add a tooltip to the marker
            marker.bindTooltip(waypoint.description, { permanent: false, interactive: true })
              .openTooltip();

            // Use bindPopup to add a popup to the marker (optional)
            marker.bindPopup(waypoint.description).openPopup();

            // Add the image to the marker
            const icon = L.icon({
              iconUrl: waypoint.imagePath,
              iconSize: [32, 32], // adjust the size as needed
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
            });

            marker.setIcon(icon);
          });

          const routingControl = createRoutingControl(map, storedWaypoints.map((w) => w.latLng));

          if (routeOldId !== button.value) {
            console.log('Value changed from', routeOldId, 'to', button.value);
          }

          routeOldId = button.value;
        } else {
          console.error('No waypoints available in local storage');
        }
      });
  });
}


function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);

  // Get geolocation data and initialize the map
  getGeolocationData()
    .then((data) => {
      const x = data.latitude;
      const y = data.longitude;

      // Create the map once the geolocation data is obtained
      const map = createMap(x, y);

      // Add event listeners for buttons
      const buttons = document.querySelectorAll('button');
      let routeOldId;
      buttons.forEach((button) => {
        onButtonClick(button, x, y, map, routeOldId);
      });
    })
    .catch((error) => {
      console.error("Error getting geolocation data:", error.message);
      // Handle the case where geolocation data is not available
    });
}