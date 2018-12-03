function getData() {
  $.get("http://data.citedia.com/r1/parks/", function(data, statuts){
    console.log(data.parks);

    var park = data.parks;
    var name;
    var free;
    var max;
    var status;
    var statusInt
    var pourcent;

    $("#parkings").html("");

    for (var i = 0; i < park.length; i++){

      name = park[i].parkInformation.name;
      free = park[i].parkInformation.free;
      max = park[i].parkInformation.max;
      statusInt = park[i].parkInformation.status;
      pourcent = Math.floor((free/max)*100);

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

      console.log(pourcent);
      $("#parkings").append("<div class='parking' id='parking"+i+"'> <h2>"+name+"</h2> <p>"+status+"</p> <p>"+free+"/"+max+" places libres</p>");

      if (pourcent < 15 && pourcent > 5){
        $("#parking"+i).css("background-color", "orange");
        $("#parking"+i).css("color", "white");
        $("#parking"+i).css("border-radius", "10px");
      }
      else if (pourcent < 5){
        $("#parking"+i).css("background-color", "red");
        $("#parking"+i).css("color", "white");
        $("#parking"+i).css("border-radius", "10px");
      }
      else{
        $("#parking"+i).css("background-color", "green");
        $("#parking"+i).css("color", "white");
        $("#parking"+i).css("border-radius", "10px");
      }
    }
  });

  $.get("https://data.explore.star.fr/api/records/1.0/search/?dataset=tco-parcsrelais-etat-tr&facet=nom&facet=etat", function(data, statuts){
    console.log(data.records);

    var park2 = data.records;
    var name2;
    var max2;
    var free2;
    var status2;
    var statusInt2;
    var pourcent2;

    for(var j = 0; j < park2.length; j++){
      name2 = park2[j].fields.nom;
      max2 = park2[j].fields.capaciteactuelle;
      free2 = park2[j].fields.nombreplacesdisponibles;
      statusInt2 = park2[j].fields.etat;
      pourcent2 = Math.floor((free2/max2)*100);

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

      console.log(pourcent2);
      $("#parkings").append("<div class='parking' id='parking"+(j+10)+"'> <h2>"+name2+"</h2> <p>"+status2+"</p> <p>"+free2+"/"+max2+" places libres</p>");

      if (pourcent2 < 15 && pourcent2 > 5){
        $("#parking"+(j+10)).css("background-color", "orange");
        $("#parking"+(j+10)).css("color", "white");
        $("#parking"+(j+10)).css("border-radius", "10px");
      }
      else if (pourcent2 < 5){
        $("#parking"+(j+10)).css("background-color", "red");
        $("#parking"+(j+10)).css("color", "white");
        $("#parking"+(j+10)).css("border-radius", "10px");
      }
      else{
        $("#parking"+(j+10)).css("background-color", "green");
        $("#parking"+(j+10)).css("color", "white");
        $("#parking"+(j+10)).css("border-radius", "10px");
      }
    }
  });
}

getData();
