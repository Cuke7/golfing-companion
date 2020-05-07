var markers = new L.FeatureGroup();

document.addEventListener("DOMContentLoaded", function(event) {


  initMap();

  // For dev purpose:
  let uri = "44.492933,-0.639850,6 mai 2020 17:34:07,tag 006 OK\n44.494933,-0.636850,6 mai 2020 17:41:33,tag 005 OK\n44.491933,-0.632850,6 mai 2020 17:42:01,tag 001 OK";
  uri = uri.replace(/\n/g, "%0A");
  let encoded = encodeURI("?data=" + uri);
  encoded = "?data=" + uri;
  console.log(encoded);
  //---------------


  let url_params = getUrlVars();

  if(url_params.hasOwnProperty("data") ){
    toggle_UI();
    let game_data = decodeURI(url_params.data)
    show_game_data(game_data)
  }

  console.log("44.492595,-0.6427769,7%20mai%202020%2015:49:39,Hello%20world!%0A44.4931005,-0.6398907,7%20mai%202020%2015:51:39,Hello%20world!%0A");
});

function toggle_UI(){
  document.getElementById('header_div').classList.toggle('hidden');
  document.getElementById('input_button').classList.toggle('hidden');
  document.getElementById('map').style.height = '80vh';
}

function show_game_data(game_data){
  markers.clearLayers();
  var latlngs = [];
  game_data.split("\n").forEach(elem => {
    let markers_data = elem.split(',')
    add_marker(markers_data[0], markers_data[1], markers_data[2]+"\n"+markers_data[3])
    latlngs.push([markers_data[0], markers_data[1]]);
  })

  var polyline = L.polyline(latlngs, {
    color: 'red'
  })
  markers.addLayer(polyline);
  macarte.addLayer(markers);
  macarte.fitBounds(polyline.getBounds(),{padding: [0,100]});
}


function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

var macarte = null;

function initMap() {
  var lat = 44.492933;
  var lon = -0.639850;

  macarte = L.map('map').setView([lat, lon], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
  }).addTo(macarte);
}

function add_marker(lat, long, text){
  var m = L.marker([lat, long]);
  markers.addLayer(m);
  macarte.addLayer(markers);
  p = new L.Popup({
    autoClose: false,
    closeOnClick: false
  })
  .setContent(text);
  m.bindPopup(p).openPopup();
}

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

/*
function handleFileSelect(evt) {
var file = evt.target.files; // FileList object
var selectedFile = document.getElementById('file').files[0];
console.log(selectedFile);
var reader = new FileReader();
reader.onload = function(event) {
let temp = reader.result.split("\n");

for (var i = 0; i < temp.length; i++) {
tab.push(temp[i].split(","));
}
tab.pop();
for (var i = 0; i < tab.length; i++) {
markers.push({
pos: [tab[i][0], tab[i][1]],
popup: tab[i][2].trim() + "\n" + tab[i][3].trim()
})
}

console.log(markers);

markers.forEach(function(obj) {
var m = L.marker(obj.pos).addTo(macarte),
p = new L.Popup({
autoClose: false,
closeOnClick: false
})
.setContent(obj.popup)
.setLatLng(obj.pos);
m.bindPopup(p).openPopup();
});
var latlngs = [];
for (var i = 0; i < markers.length; i++) {
latlngs.push(markers[i].pos);
}

var polyline = L.polyline(latlngs, {
color: 'red'
}).addTo(macarte);
macarte.fitBounds(polyline.getBounds());
};
reader.readAsText(selectedFile);
}

function add_markers_from_string(string){
let arr = string.split(',');
var chunk_size = 4;
var groups = arr.map( function(e,i){
return i%chunk_size===0 ? arr.slice(i,i+chunk_size) : null;
}).filter(function(e){ return e; });
//console.log({arr, groups})

let markers = [];

for(let i = 0; i < groups.length; i++){
//add_marker(groups[i][0], groups[i][1], timeConverter(parseInt(groups[i][3],10))+"\n"+groups[i][2])
markers.push({
pos: [groups[i][0], groups[i][1]],
popup: groups[i][3]+"\n"+groups[i][2]
})
}

console.log(markers);

markers.forEach(function(obj) {
var m = L.marker(obj.pos).addTo(macarte),
p = new L.Popup({
autoClose: false,
closeOnClick: false
})
.setContent(obj.popup)
.setLatLng(obj.pos);
m.bindPopup(p).openPopup();
});

var latlngs = [];
for (var i = 0; i < markers.length; i++) {
latlngs.push(markers[i].pos);
}

var polyline = L.polyline(latlngs, {
color: 'red'
}).addTo(macarte);
//console.log(polyline.getBounds())
macarte.fitBounds(polyline.getBounds(),{padding: [75,75]});

var elements = document.getElementsByClassName("leaflet-popup-content");

for (var element of elements) {
//element.style.width = "auto";
}

}

function add_demos_markers(){

markers = [
{
pos: [44.492933, -0.639850],
popup: "text 1"
},
{
pos: [44.494933, -0.636850],
popup: "text 2"
},
{
pos: [44.491933, -0.632850],
popup: "text 3"
}
]


markers.forEach(function(obj) {
var m = L.marker(obj.pos).addTo(macarte),
p = new L.Popup({
autoClose: false,
closeOnClick: false
})
.setContent(obj.popup)
.setLatLng(obj.pos);
m.bindPopup(p).openPopup();
});

var latlngs = [];
for (var i = 0; i < markers.length; i++) {
latlngs.push(markers[i].pos);
}

var polyline = L.polyline(latlngs, {
color: 'red'
}).addTo(macarte);
//console.log(polyline.getBounds())
macarte.fitBounds(polyline.getBounds(),{padding: [75,75]});
}

*/
