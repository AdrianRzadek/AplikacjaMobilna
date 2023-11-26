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

document.addEventListener("deviceready", onDeviceReady, false);

// Declare a global object to store geolocation data
//var geolocationData = {};

// Define a function to get geolocation data as a Promise
function getGeolocationData() {
  return new Promise((resolve, reject) => {
    // Define the success callback function
    var onSuccess = function (position) {
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
    function onError(error) {
      reject(error);
    }

    // Get the current geolocation position
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  });
}

// Use the Promise to get geolocation data
getGeolocationData().then((data) => {
  console.log(data.latitude);
  console.log(data.longitude);
  // You can use other geolocationData properties here
  var x = data.latitude;
  var y = data.longitude;

  console.log(x);
  console.log(y);

  var map = L.map("map").setView([x, y], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);


  var buttons = document.querySelectorAll('button');
  var routeId;
  var routeOldId;
  var routingControl;
  buttons.forEach(function(button) {
   // Store the initial value
  
      button.addEventListener("click", function() {
          console.log('Button clicked. Current value:', button.value);
          // Check if the value has changed
         
       
      fetch(`http://localhost:3000/api/v1/points`)
        .then((response) => response.json())
        .then((data) => {
          var routes = data.data;
          routeId = button.value; 
          // Find the selected route based on routeId
          var selectedRoute = routes.find((route) =>
            route.hasOwnProperty(routeId)
          );

          if (selectedRoute) {
            var pointsArray = selectedRoute[routeId];

            console.log(
              `Response from points array for route ${routeId}:`,
              pointsArray
            );

            const waypoints = pointsArray.map((point) =>
              L.latLng(point.x, point.y)
            );
            waypoints.unshift(L.latLng(x, y));
         
         
            var marker = L.marker([x, y]).addTo(map).bindPopup("Jesteś tutaj").openPopup();
          var routingControl = L.Routing.control({
              waypoints: waypoints,
            }).addTo(map);


            if(routeOldId !== routeId){
            console.log('Value changed from', routeOldId, 'to', routeId);
        
            map.eachLayer(function (layer) {
              if (layer instanceof L.Marker) {
                map.removeLayer(layer);
              }
        });

              L.marker([x, y]).addTo(map).bindPopup("Jesteś tutaj").openPopup();
              routingControl = L.Routing.control({
                waypoints: waypoints,
              }).addTo(map);
            }
            
          }
          routeOldId = routeId; 
        
        })
        .catch((error) => {
          console.error("Error getting geolocation data:", error.message);
        });
      } 
    );
  });
});

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}
