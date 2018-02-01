var url='https://api.coindesk.com/v1/bpi/historical/close.json?start=2016-01-31&end=2018-01-31';

var btn = document.querySelector('button');

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
var yyy2 =yyyy-2;

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

today = yyyy + '-' + mm + '-' + dd;
var last= yyy2 + '-' + mm + '-' + dd;

graph(last,today);

d3.json('https://api.coindesk.com/v1/bpi/historical/close.json?start=2016-01-31&end=2018-01-31', function(error, data) {

          
    var note=data.disclaimer;
    var text=document.getElementById("disclaimer")
    text.innerHTML+= "<p>"+note+"</p>";

});

btn.onclick =function plot(){

    var start= document.getElementById("start").value;
    var end= document.getElementById("end").value;

    console.log(start,end);
    graph(end,start);

}


function graph(end,start){

    var url1="https://api.coindesk.com/v1/bpi/historical/close.json?start="+end+"&end="+start;

    d3.json(url1, function(error, data) {
        if (error) return console.warn(error);

        var bpi = data.bpi;
        var key = Object.keys(bpi);
        var value = Object.values(bpi);
      
      
        var trace1 = {
          type: "scatter",
          mode: "lines",
          name: 'Bitcoin Close',
          x: key,
          y: value,
          line: {color: '#460000'}
        }
      
        var data = [trace1];
        var layout = {
          title: 'Bitcoin Market Analysis',
        };
        
       Plotly.newPlot('open', data, layout);
           
      });


}



