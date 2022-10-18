// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
earthquakeData = data.features

// Define function to set the circle size based on the depth
function MarkerSize(feature) {
	return {
		radius: feature.properties.mag * 2,
		fillColor: MarkerColor(feature.geometry.coordinates[2]),
		fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
	}
  }

// Determine the marker color by depth
function MarkerColor(depth) {
    switch(true) {
      case depth < 10:
        return "green";
      case depth < 30:
        return "lightgreen";
      case depth < 50:
        return "yellow";
      case depth < 70:
        return "orange";
      case depth < 90:
        return "red";
	  case depth > 90:
		return "darkred";
      default:
        return "black";
    }
  }
 
  
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.title}</h3>`);
  }

  var earthquakes = L.geoJSON(earthquakeData, {
	onEachFeature: onEachFeature,
	pointToLayer: function(feature,latlng) {
		return L.circleMarker(latlng);
	},
	style: MarkerSize
})

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  }

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      42.3, 21.2
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });

  
  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

});

// Create a legend control.
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Depth</h4>";
  div.innerHTML += '<i style="background: #00FF00"></i><span>Under 10</span><br>';
  div.innerHTML += '<i style="background: #90EE90"></i><span>10 to 30</span><br>';
  div.innerHTML += '<i style="background: #FFFF00"></i><span>30 to 50</span><br>';
  div.innerHTML += '<i style="background: #FFA500"></i><span>50 to 70</span><br>';
  div.innerHTML += '<i style="background: #FF0000"></i><span>70 to 90</span><br>';
  div.innerHTML += '<i style="background: #8B0000"></i><span>Over 90</span><br>';
   
  return div;
};
legend.addTo(myMap);