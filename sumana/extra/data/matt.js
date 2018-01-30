var map = L.map('map').setView([40, 20], 2.3);
var mapboxAccessToken = "pk.eyJ1Ijoic3VtYW5hNzciLCJhIjoiY2pha2EwOGNkMmZlaTJxcGRuODd2Zm90MSJ9.sirUWOzphXjCGBzrkXPsDQ";
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
        id: 'mapbox.light',
        attribution: 'Map Bitcoin Trade Analysis'
    }).addTo(map);
   
// Set default dataset on load
L.geoJson(volume,{style: style}).addTo(map);
 // L.geoJson(trade,{style: tradestyle}).addTo(map);

/*
Don't think we need the below volume and trade functions anymore, but leaving them there just in case.
*/


function volumemap(){

    //var mapboxAccessToken = "pk.eyJ1Ijoic3VtYW5hNzciLCJhIjoiY2pha2EwOGNkMmZlaTJxcGRuODd2Zm90MSJ9.sirUWOzphXjCGBzrkXPsDQ";
    // var map = L.map('map').setView([40, 20], 2.3);

    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    //     id: 'mapbox.light',
    //     attribution: 'Map Bitcoin Trade Analysis'
    // }).addTo(map);
   
   //L.geoJson(volume,{style: style}).addTo(map);
    
    for ( var i=0; i < trade_volume.length; i++ ) 
    {
        var circle = L.circle([trade_volume[i].Latitude, trade_volume[i].Longitude] , {
        color: '#f03',
        fillColor: '#f03',
        fillOpacity: 0.75,
        radius: 100000
        }).addTo(map);
    
        circle.bindPopup( "<b>Currency</b> : " + trade_volume[i].Currency +"<br> <b>Trade Volume</b> : " +trade_volume[i].Trade_Volume +"<br><b> No. Of Exchange </b>: " + trade_volume[i].Exchange_count);
    
    }
}

function trademap(){

    var mapboxAccessToken = "pk.eyJ1Ijoic3VtYW5hNzciLCJhIjoiY2pha2EwOGNkMmZlaTJxcGRuODd2Zm90MSJ9.sirUWOzphXjCGBzrkXPsDQ";
    // var map = L.map('map').setView([40, 20], 2.3);

    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    //     id: 'mapbox.light',
    //     attribution: 'Map Bitcoin Trade Analysis'
    // }).addTo(map);

    //L.geoJson(trade,{style: tradestyle}).addTo(map);
   

    for ( var i=0; i < avgtrade.length; i++ ) 

    {
    L.marker([avgtrade[i].Latitude, avgtrade[i].Longitude] )
        .bindPopup( "<b>Currency</b> : " + avgtrade[i].Currency +"<br> <b>Avg Trade per min</b> : " +avgtrade[i].Avg_Trade_per_min +"<br><b> No. Of Exchange </b>: " + avgtrade[i].Exchange_count )
        .addTo(map);

    }

}

function getColor(d) {
    return d > 6240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 ? '#800000' :
           d > 1443628445320690000000000000000000000000000  ? '#992600' :
           d > 41600000000000000000000000000  ? '#cccc00' :
           d > 3090000000000000000000000  ? '#006666' :
           d > 3580000000000000000000   ? '#002db3' :
           d > 512609309114671000   ? '#6A1B9A  ' :
           d > 200000000000   ? '#512DA8' :
           d > 18464810423   ? '#3949AB' :
           d > 1766748142   ? '0D47A1' :
           d > 87913439   ? '#1976D2' :
           d > 481744   ? '#2196F3' :
           d > 11142   ? '#42A5F5' :
           d > 1308   ? '#90CAF9' :
           d > 440   ? '#E3F2FD' :
                      '#F5F5F5';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.volumetrade),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.7
    };
}


// ----------------------------------trade-----------------------------------------------------

function tradegetColor(d) {
    return d > 5 ? '#990000' :
           d > 3  ? '#A3190A' :
           d > 1  ? '#B2401A' :
           d > .5  ? '#C7732E' :
           d > .1  ? '#E6BF4C' :
           d > .05   ? '#F5E65C' :
           d > 0   ? '#FFFF66' :
                      '#F5F5F5';
}

function tradestyle(feature) {
    return {
        fillColor: tradegetColor(feature.properties.avgtrade),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


function getData(arg){

    console.log(arg);

    if(arg == "trade")
    {
        // If selector is trade return trade JSON
        console.log("Trade printed")
        return  L.geoJson(trade,{style: tradestyle}).addTo(map);

    }

    else if (arg == "volume")
    {
        // If selector is volume return volume JSON
        console.log("volume printed")
        return  L.geoJson(volume,{style: style}).addTo(map);
    }

}
