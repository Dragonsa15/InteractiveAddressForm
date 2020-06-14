const mapArea = document.querySelector('#mapid');

const actionBtn = document.querySelector('.location');
let locationsAvailable;
let mymap, marker;

getLocation = function(accessToken) {
    var latitude = 0;
    var longitude = 0;
    
    mapArea.style.height = "250px";

    var url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + accessToken;
    
    mapDisplay(url);
    SetMarker(latitude,longitude);
}

function mapDisplay(url) {
    mymap = L.map('mapid').fitWorld();
    
    L.tileLayer(url , {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
    }).addTo(mymap);
}

function SetMarker(latitude,longitude) {

    mymap.locate({setView: true, minZoom: 20});
    function onLocationFound(e) {
        marker = L.marker(e.latlng).addTo(mymap)
        latitude = e.latlng.lat;
        longitude = e.latlng.lng;

        document.querySelector("#longitude").value = longitude;
        document.querySelector("#latitude").value = latitude;
        getGeolocation(latitude,longitude);

    }
    
    console.log(document.querySelector("#longitude").value);
    mymap.setView([latitude,longitude],20);


    mymap.on('locationfound', onLocationFound);
    mymap.doubleClickZoom._enabled = false;
    
    mymap.on('dblclick',function(event) {
        mymap.doubleClickZoom.disable();
        marker.setLatLng(event.latlng);
        latitude = event.latlng.lat;
        longitude = event.latlng.lng;
        getGeolocation(latitude,longitude);
        
        setTimeout(() => {
            console.log('hello');
            mymap.doubleClickZoom.enable();
          }, 10);
        
          console.log(longitude,latitude);
          document.querySelector("#longitude").value = longitude;
          document.querySelector("#latitude").value = latitude;
    });
    
}

getGeolocation = (lat, lng) => {
    theUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    autocompleteOnbutton(JSON.parse(xmlHttp.responseText));
}
  
function autocompleteOnbutton(values) {
    console.log(values);
    document.querySelector("#country").value = values.countryName; 
    document.querySelector("#state").value = values.principalSubdivision;
    document.querySelector("#city").value  = values.locality;
}


//Not working Right now
function autocompleteonfield(accessToken) {    
    if(document.querySelector("#postalCode").value)
    {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        theUrl = `https://atlas.mapmyindia.com/api/places/geocode?address=mapmyindia 237 okhla phase 3`;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", proxyurl + theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        console.log(xmlHttp.responseText);
    }
}

//https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=37.42159&longitude=-122.0837&localityLanguage=en

function autocompleteonaddress(accessToken,addID) {    
    (function() {
        //Setting up the Places Api derivative from algolia
        var AutoCompleteInit = places({
            appName: "AutoComplete Test",
            addID: addID,
            apiKey: accessToken,
            container: document.querySelector("#address"),
            templates: {
                value: function(suggestion) {
                    return suggestion.name;
                }
            }
        }).configure({
            type: "address"
        })
    
        AutoCompleteInit.on('change',function SelectedValue(e) {
            document.querySelector('#state').value = e.suggestion.administrative || '';
            console.log(e.suggestion.city);
            document.querySelector('#city').value = e.suggestion.city || '';
            document.querySelector('#postalCode').value = e.suggestion.postcode || '';
        });
    })();
}
