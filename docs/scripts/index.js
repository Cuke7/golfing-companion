//


var markers = new L.FeatureGroup();
var macarte = null;

document.addEventListener("DOMContentLoaded", function(event) {

  initMap();


  // Resize de the map to fit to the sreen
  let h = window.innerHeight - document.getElementById("container").clientHeight;
  console.log(h);
  document.getElementById('map').style.height = h-40+"px"


  // For dev purpose:
  let dummy_data = "44.492933,-0.639850,6 mai 2020 17:34:07,tag 006 OK%0A44.494933,-0.636850,6 mai 2020 17:41:33,tag 005 OK%0A44.491933,-0.632850,6 mai 2020 17:42:01,tag 001 OK";
  let uri = "44.492933,-0.639850,6 mai 2020 17:34:07,tag 006 OK\n44.494933,-0.636850,6 mai 2020 17:41:33,tag 005 OK\n44.491933,-0.632850,6 mai 2020 17:42:01,tag 001 OK";
  uri = uri.replace(/\n/g, "%0A");
  let encoded = encodeURI("?data=" + uri);
  encoded = "?data=" + uri;
  console.log(encoded);
  document.getElementById('game_data').value = "44.492933,-0.639850,6 mai 2020 17:34:07,tag 006 OK%0A44.494933,-0.636850,6 mai 2020 17:41:33,tag 005 OK%0A44.491933,-0.632850,6 mai 2020 17:42:01,tag 001 OK";


  // Get the url info if there is any
  let url_params = getUrlVars();

  if(url_params.hasOwnProperty("data") ){
    // Hide the header and the input/button
    document.getElementById('header_div').classList.toggle('hidden');
    document.getElementById('input_button').classList.toggle('hidden');
    document.getElementById('map').style.height = '80vh';
    let game_data = decodeURI(url_params.data)
    show_game_data(game_data)
  }
});


function show_game_data(game_data){
  // Reset the map
  markers.clearLayers();

  // Object for the polyline
  var latlngs = [];

  // Get the info from the game_data and display the markers
  game_data.split("\n").forEach(elem => {
    let markers_data = elem.split(',')
    add_marker(markers_data[0], markers_data[1], markers_data[2].substring(11)+"\n"+markers_data[3])
    //add_marker(markers_data[0], markers_data[1], markers_data[2]+"\n"+markers_data[3])
    latlngs.push([markers_data[0], markers_data[1]])
  })

  console.log(latlngs);

  // Show a red line that connect all the markers
  for(let i = 1; i < latlngs.length; i++){
    console.log(i);
    let distance = macarte.distance(latlngs[i-1], latlngs[i]).toFixed(2) + "m"
    var polyline = L.polyline([latlngs[i-1], latlngs[i]], {
      color: 'red'
    })
    polyline.bindTooltip(distance, {permanent: true});
    markers.addLayer(polyline);
  }
  macarte.addLayer(markers);
  var polylines = L.polyline(latlngs);
  macarte.fitBounds(polylines.getBounds(),{padding: [0,0]});
}


function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

function initMap() {
  // Hostens <3
  var lat = 44.492933;
  var lon = -0.639850;

  macarte = L.map('map').setView([lat, lon], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
  }).addTo(macarte);
}

function add_marker(lat, long, text){
  var m = L.marker([lat, long]);
  m.bindTooltip(text, {permanent: true,  direction: "top"});
  markers.addLayer(m);
  macarte.addLayer(markers);
  p = new L.Popup({
    autoClose: false,
    closeOnClick: false
  })
  //.setContent(text);
  //m.bindPopup(p).openPopup();
}

// Function called from the button
function show_data(){
  let data = document.getElementById("game_data").value;
  let game_data = decodeURI(data)
  show_game_data(game_data)
}

(function() { var cleanUp, debounce, i, len, ripple, rippleContainer, ripples, showRipple;

  debounce = function(func, delay) {
    var inDebounce;
    inDebounce = undefined;
    return function() {
      var args, context;
      context = this;
      args = arguments;
      clearTimeout(inDebounce);
      return inDebounce = setTimeout(function() {
        return func.apply(context, args);
      }, delay);
    };
  };

  showRipple = function(e) {
    var pos, ripple, rippler, size, style, x, y;
    ripple = this;
    rippler = document.createElement('span');
    size = ripple.offsetWidth;
    pos = ripple.getBoundingClientRect();
    x = e.pageX - pos.left - (size / 2);
    y = e.pageY - pos.top - (size / 2);
    style = 'top:' + y + 'px; left: ' + x + 'px; height: ' + size + 'px; width: ' + size + 'px;';
    ripple.rippleContainer.appendChild(rippler);
    return rippler.setAttribute('style', style);
  };

  cleanUp = function() {
    while (this.rippleContainer.firstChild) {
      this.rippleContainer.removeChild(this.rippleContainer.firstChild);
    }
  };

  ripples = document.querySelectorAll('[ripple]');

  for (i = 0, len = ripples.length; i < len; i++) {
    ripple = ripples[i];
    rippleContainer = document.createElement('div');
    rippleContainer.className = 'ripple--container';
    ripple.addEventListener('mousedown', showRipple);
    ripple.addEventListener('mouseup', debounce(cleanUp, 2000));
    ripple.rippleContainer = rippleContainer;
    ripple.appendChild(rippleContainer);
  }
}());
