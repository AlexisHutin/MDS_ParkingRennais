var MAP = L.map('map').setView([48.110476, -1.680218], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(MAP);

////////////////////////////////////////////////////////////////////////////////

function getData(currentPosition) {
  $.get("http://data.citedia.com/r1/parks/?crs=EPSG:4326", function(data, statuts){

    var parks = data.parks;
    var features = data.features.features;
    var res;
    var distTmp;
    var dist;
    var tabDist = [];

    for( var i = 0; i < parks.length; i++){
      var park = parks[i];
      var parkInfo = park.parkInformation;
      var parkId = park.id;
      var coord = searchCoord(features, parkId);
      var color;
      var statusInt = park.parkInformation.status;
      var status;
      var free = park.parkInformation.free;
      var max = park.parkInformation.max;
      var pourcent = Math.floor((free/max)*100);


      dist = distanceInKmBetweenEarthCoordinates(
        coord[1],coord[0],currentPosition.latitude,currentPosition.longitude
      );
      console.log(parkInfo.name, dist);
      tabDist.push({
        name : parkInfo.name,
        dist : dist
      });

      if (dist < distTmp){
        res = parkInfo;
        distTmp = dist;
      }

      if(statusInt != "AVAILABLE"){
        status  = "FERME"
      }
      else if (pourcent < 5) {
        status = "PLEIN"
      }
      else if (pourcent < 15) {
        status = "PRESQUE PLEIN"
      }
      else {
        status = "PLACE DISPONIBLES"
      }


      if (pourcent < 15 && pourcent > 5){
        color = "orange";
      }
      else if (pourcent < 5){
        color = "red";
      }
      else{
        color = "green";
      }

      console.log(park, coord);
      L.marker([coord[1], coord[0]]).addTo(MAP)
          .bindPopup("<div class="+color+"> <p>"+parkInfo.name+"</p> <p>"+status+"</p> <p>"+parkInfo.free+"/"+parkInfo.max+"</p> </div>");
          //.openPopup();
    }
    //////////////////////////////////////////////////////////////////////////////////

    $.get("https://data.explore.star.fr/api/records/1.0/search/?dataset=tco-parcsrelais-etat-tr&facet=nom&facet=etat", function(data, statuts){
      console.log(data.records);

      var park2 = data.records;
      var name2;
      var max2;
      var free2;
      var status2;
      var statusInt2;
      var pourcent2;
      var coord2;

      for(var j = 0; j < park2.length; j++){
        name2 = park2[j].fields.nom;
        max2 = park2[j].fields.capaciteactuelle;
        free2 = park2[j].fields.nombreplacesdisponibles;
        statusInt2 = park2[j].fields.etat;
        coord2 = park2[j].fields.coordonnees;
        pourcent2 = Math.floor((free2/max2)*100);


        dist = distanceInKmBetweenEarthCoordinates(
          coord2[0],coord2[1],currentPosition.latitude,currentPosition.longitude
        );
        console.log(name2, dist);
        tabDist.push({
          name : name2,
          dist : dist
        });

        if(statusInt2 != "Ouvert"){
          status2  = "FERME"
        }
        else if (pourcent2 < 5) {
          status2 = "PLEIN"
        }
        else if (pourcent2 < 15) {
          status2 = "PRESQUE PLEIN"
        }
        else {
          status2 = "PLACE DISPONIBLES"
        }

        if (pourcent2 < 15 && pourcent2 > 5){
          color = "orange";
        }
        else if (pourcent2 < 5){
          color = "red";
        }
        else{
          color = "green";
        }

        L.marker([coord2[0], coord2[1]]).addTo(MAP)
            .bindPopup("<div class="+color+"> <p>"+name2+"</p> <p>"+status2+"</p> <p>"+free2+"/"+max2+"</p> </div>");
            //.openPopup()

        }
    });

  });
    //for(var k = 0; k < tabDist.length; k++){
      //console.log(tabDist[k]);
    //}

}

function searchCoord(features, parkId){
  for( var j = 0; j < features.length; j++){
    var feature = features[j];
    if(feature.id == parkId){
      // retour coord
      return feature.geometry.coordinates;
    }
  }
}

function geoLoc(callback){
  navigator.geolocation.getCurrentPosition(function(position){
    console.log(position);

    if(!position){
      return;
    }
    var coords = position.coords;

    //accuracy pour precision et raduis du cercle

    L.circle([coords.latitude, coords.longitude], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 250
    }).addTo(MAP);

    callback(coords);
  });
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return earthRadiusKm * c;
}


//main
//getData();
geoLoc(function(coords){
  getData(coords)
});
