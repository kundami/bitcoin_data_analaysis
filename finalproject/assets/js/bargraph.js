function paintGraph(selection) {
console.log("painting =",selection);
var prop='Exchange_count';
var name = 'Exchange Count';
if(selection === 'volume') {
  prop = 'Trade_Volume';
  name = 'Trade Volume';
} 
else if (selection === 'trade') {
    prop = 'Avg_Trade_per_min';
    name = 'Average Trade per Minute';
}
document.getElementById("bar").innerHTML = "";  
  // set the dimensions and margins of the graph
  var margin = {top: 0, right: 30, bottom: 150, left: 90},
      width = 1200 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

  var color = ["#3e0808", "#4d0a0a", "#5d0c0c", "#6c0e0e", "#7c1010","#8c1212", "#9b1414","#ab1616","#ba1818","#ca1a1a","#d91c1c","#e22525","#e43434","#e64444","#e85353","#ea6363","#ec7272","#ee8282","#f09292","#f2a1a1"];

  // set the ranges
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);
            
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin

  var svg = d3.select("#bar").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  // get the data
  d3.csv("../assets/data/d3file.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
      d[prop] = +d[prop];
      
    });
    var topData = data.sort(function(a, b) {
      return d3.descending(+a[prop], +b[prop]);
      }).slice(0, 20);

    // Scale the range of the data in the domains
    x.domain(topData.map(function(d) { return d.Country; }));
    if(prop === 'Trade_Volume') {
      y.domain([d3.min(topData, function(d) { return Math.log(d[prop]); }), 
                d3.max(topData, function(d) { return Math.log(d[prop]); })]);
    }
    else {
      y.domain([0, d3.max(topData, function(d) { return d[prop]; })]);
    }
    
    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(topData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Country); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) {
          var p = d[prop];
          if(prop === 'Trade_Volume') {
            p = Math.log(p);
          }
          return y(p); 
        })
        .attr("height", function(d) { 
          var p = d[prop];
          if(prop === 'Trade_Volume') {
            p = Math.log(p);
          }
          return height - y(p); })
        // .style("fill","#000058")
        .style("fill", function(d, i) {
          return color[i];
        });

    // add the x Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -10)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .style("font-size","12px");

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+20)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(name);

      svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style("font-size","28px")
      .attr('class', 'chart-title')
      .text("Top 20 Countries by "+name);

  });
}

function getFactor(arg){
  
  if (arg=='count')
  {
    paintGraph('count');
  }
  else if (arg=='volume')
  {
    paintGraph('volume');   
  }
  else
  {
    paintGraph('trade'); 
  }
}
paintGraph('count');