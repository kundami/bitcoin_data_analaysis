var mapboxAccessToken = "pk.eyJ1Ijoic3VtYW5hNzciLCJhIjoiY2pha2EwOGNkMmZlaTJxcGRuODd2Zm90MSJ9.sirUWOzphXjCGBzrkXPsDQ";
var map = L.map('map').setView([40, 20], 2.3);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map Bitcoin Trade Analysis'
}).addTo(map);

volumemap();


function volumemap(){

    L.geoJson(volume,{style: style}).addTo(map);
    
    for ( var i=0; i < trade_volume.length; i++ ) 
        {
            var circle = L.circle([trade_volume[i].Latitude, trade_volume[i].Longitude] , {
            color: '#150b31',
            fillColor: '#150b31',
            fillOpacity: 1,
            radius: 50000
            }).addTo(map);
        
            circle.bindPopup( "<b>Currency</b> : " + trade_volume[i].Currency +"<br> <b>Trade Volume</b> : " +trade_volume[i].Trade_Volume +"<br><b> No. Of Exchange </b>: " + trade_volume[i].Exchange_count);
        
        }
}

function trademap(){

    L.geoJson(trade,{style: tradestyle}).addTo(map);
   
    for ( var i=0; i < avgtrade.length; i++ ) 

        {
            var circle = L.circle([avgtrade[i].Latitude, avgtrade[i].Longitude] , {
            color: '#191970',
            fillColor: '#191970',
            fillOpacity: 1,
            radius: 50000
            }).addTo(map);
        
            circle.bindPopup( "<b>Currency</b> : " + avgtrade[i].Currency +"<br> <b>Avg Trade per min</b> : " +avgtrade[i].Avg_Trade_per_min +"<br><b> No. Of Exchange </b>: " + avgtrade[i].Exchange_count );
        
        }

}

function getColor(d) {
    return d > 6140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 ? '#460000' :
           d > 1343628445320690000000000000000000000000000  ? '#67000d' :
           d > 40600000000000000000000000000  ? '#a50f15' :
           d > 3080000000000000000000000  ? '#cb181d' :
           d > 3480000000000000000000   ? '#ef3b2c' :
           d > 502609309114671000   ? '#fb6a4a ' :
           d > 100000000000   ? '#fc9272' :
           d > 86913439   ? '#fcbba1' :
           d > 471744   ? '#fee0d2' :
           d > 440   ? '#ffd3bd' :
                      '#f0f0f0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.volumetrade),
        weight: 1,
        opacity: .25,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.7
    };
}


function tradegetColor(d) {
    return d > 5 ? '#67000d' :
           d > 3  ? '#a50f15' :
           d > 1  ? '#cb181d' :
           d > .5  ? '#ef3b2c' :
           d > .1  ? '#fb6a4a' :
           d > .05   ? '#fc9272' :
           d > 0   ? '#ffd3bd' :
                      '#f0f0f0';
}

function tradestyle(feature) {
    return {
        fillColor: tradegetColor(feature.properties.avgtrade),
        weight: 2,
        opacity: .25,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getData(arg){

if(arg == "trade")
    {
        return  trademap();
    }

else if (arg == "volume")
    {
        return volumemap();
    }
}
