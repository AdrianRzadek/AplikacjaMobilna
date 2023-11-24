/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready


document.addEventListener('deviceready', onDeviceReady, false);


// Declare a global object to store geolocation data
//var geolocationData = {};

// Define a function to get geolocation data as a Promise
function getGeolocationData() {
  return new Promise((resolve, reject) => {
    // Define the success callback function
    var onSuccess = function(position) {
      geolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp
      };

      // Resolve the Promise with geolocationData
      resolve(geolocationData);
    };

    // Define the error callback function
    function onError(error) {
      reject(error);
    }

    // Get the current geolocation position
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  });
}

// Use the Promise to get geolocation data
getGeolocationData()
  .then(data => {
    console.log(data.latitude);
    console.log(data.longitude);
    // You can use other geolocationData properties here
    var x =data.latitude;
    var y =data.longitude;

    console.log(x);
    console.log(y);

var map = L.map('map').setView([x, y], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var routeNumber = getElementById();
fetch(`http://localhost:3000/api/v1/points`)
.then(response => response.json())
.then(data => {
  var pointsArray = data.data;
    console.log('Response from points array:', pointsArray);

    pointsArray.forEach((point) => {
      const pointId = point.id; // Access the ID property of the point
      fetch(`http://localhost:3000/api/v1/points/${pointId}`)
        .then(response => response.json())
        .then(data => {
          // Handle the data for each point here
          console.log(`Point ${pointId}:`, data);
          const waypoints = pointsArray.map(point => L.latLng(point.x, point.y));
          waypoints.unshift(L.latLng(x, y));
//const allPoints = getAllPoints();
//if x and y == array.waipoint  map.removeLayer(marker(x,y))
L.marker([x, y]).addTo(map)
    .bindPopup('Jesteś tutaj')
    .openPopup();
    L.Routing.control({
      waypoints: waypoints,
    }).addTo(map);
    })
    .catch(error => {
      console.error('Error getting geolocation data:', error.message);
    });

    function moveMarkers() {
      waypoints.forEach(waypoint => {
        const marker = waypointLayer.getLayers().find(layer => layer.getLatLng().equals(waypoint.latLng));
    
        // Check if the marker has reached its destination
        if (marker && marker.getLatLng().equals(waypoint.latLng)) {
          // Remove the marker from the layer group and the map
          waypointLayer.removeLayer(marker);
          console.log(`Point ${waypoint.pointId} reached its destination and was removed.`);
        }
      });
    }
    
    // Example: Simulate moving the markers every second
    setInterval(moveMarkers, 1000);

  })
})
})

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');


    

}
  
