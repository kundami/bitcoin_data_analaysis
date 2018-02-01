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
            color: '#290505',
            fillColor: '#290505',
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
            color: '#290505',
            fillColor: '#290505',
            fillOpacity: 1,
            radius: 50000
            }).addTo(map);
        
            circle.bindPopup( "<b>Currency</b> : " + avgtrade[i].Currency +"<br> <b>Avg Trade per min</b> : " +avgtrade[i].Avg_Trade_per_min +"<br><b> No. Of Exchange </b>: " + avgtrade[i].Exchange_count );
        
        }

}

function getColor(d) {
    return d > 6140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 ? '#640d0d' :
           d > 1343628445320690000000000000000000000000000  ? '#7d1010' :
           d > 40600000000000000000000000000  ? '#961313' :
           d > 3080000000000000000000000  ? '#af1616' :
           d > 3480000000000000000000   ? '#c81a1a' :
           d > 502609309114671000   ? '#e11d1d ' :
           d > 100000000000   ? '#e43636' :
           d > 86913439   ? '#e84f4f' :
           d > 471744   ? '#eb6868' :
           d > 440   ? '#ee8181' :
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
    return d > 5 ? '#520a0a' :
           d > 3  ? '#7b0f0f' :
           d > 1  ? '#a41515' :
           d > .5  ? '#cd1a1a' :
           d > .1  ? '#e43131' :
           d > .05   ? '#e95a5a' :
           d > 0   ? '#ef8383' :
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
