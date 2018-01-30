// set the dimensions and margins of the graph
var margin = {top: 0, right: 30, bottom: 150, left: 90},
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

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
d3.csv("assets/data/d3file.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.Exchange_count = +d.Exchange_count;
    
  });
  var topData = data.sort(function(a, b) {
    return d3.descending(+a.Exchange_count, +b.Exchange_count);
    }).slice(0, 20);

  // Scale the range of the data in the domains
  x.domain(topData.map(function(d) { return d.Country; }));
  y.domain([0, d3.max(topData, function(d) { return d.Exchange_count; })]);


  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(topData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Country); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.Exchange_count); })
      .attr("height", function(d) { return height - y(d.Exchange_count); })
      .style("fill","#460000");

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
    .text("Exchange count");

    svg.append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style("font-size","28px")
    .attr('class', 'chart-title')
    .text("Top 20 Countries by Exchange Count");

});

function getFactor(arg){


  if (arg=='count')

    {
      document.getElementById("bar").innerHTML = "";
      // set the dimensions and margins of the graph
      var margin = {top: 0, right: 30, bottom: 150, left: 90},
      width = 1200 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

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

      d3.csv("assets/data/d3file.csv", function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.Exchange_count = +d.Exchange_count;
      });

      console.log(data);
      var topData = data.sort(function(a, b) {
      return d3.descending(+a.Exchange_count, +b.Exchange_count);
      }).slice(0, 20);

      // Scale the range of the data in the domains
      x.domain(topData.map(function(d) { return d.Country;}));
      y.domain([0, d3.max(topData, function(d) { return d.Exchange_count; })]);


      // append the rectangles for the bar chart
      svg.selectAll(".bar")
        .data(topData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Country); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.Exchange_count); })
        .attr("height", function(d) { return height - y(d.Exchange_count); })
        .style("fill","#460000");

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
      .text("Exchange count");

      svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style("font-size","28px")
      .attr('class', 'chart-title')
      .text("Top 20 Countries by Exchange Count");
      });
    }

    else if (arg=='volume')

    {
      document.getElementById("bar").innerHTML = "";
      // set the dimensions and margins of the graph
      var margin = {top: 0, right: 30, bottom: 150, left: 90},
      width = 1200 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

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

      d3.csv("assets/data/d3file.csv", function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.Trade_Volume = +d.Trade_Volume;
      });

      var topData = data.sort(function(a, b) {
      return d3.descending(+a.Trade_Volume, +b.Trade_Volume);
      }).slice(0, 20);


      // Scale the range of the data in the domains
      x.domain(topData.map(function(d) { return d.Country;}));
      y.domain([d3.min(topData, function(d) { return Math.log(d.Trade_Volume); }), d3.max(topData, function(d) { return Math.log(d.Trade_Volume); })]);


      // append the rectangles for the bar chart
      svg.selectAll(".bar")
        .data(topData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Country); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(Math.log(d.Trade_Volume)); })
        .attr("height", function(d) { return height - y(Math.log(d.Trade_Volume)); })
        .style("fill","#460000");

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
      .text("Trade Volume");

      svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style("font-size","28px")
      .attr('class', 'chart-title')
      .text("Top 20 Countries by Trading Volume");
      });
    
    } 
    
    else

    {
      document.getElementById("bar").innerHTML = "";
      // set the dimensions and margins of the graph
      var margin = {top: 0, right: 30, bottom: 150, left: 90},
      width = 1200 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

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

      d3.csv("assets/data/d3file.csv", function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.Avg_Trade_per_min = +d.Avg_Trade_per_min;
      });

      var topData = data.sort(function(a, b) {
      return d3.descending(+a.Avg_Trade_per_min, +b.Avg_Trade_per_min);
      }).slice(0, 20);


      // Scale the range of the data in the domains
      x.domain(topData.map(function(d) { return d.Country;}));
      y.domain([0, d3.max(topData, function(d) { return d.Avg_Trade_per_min; })]);


      // append the rectangles for the bar chart
      svg.selectAll(".bar")
        .data(topData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Country); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.Avg_Trade_per_min); })
        .attr("height", function(d) { return height - y(d.Avg_Trade_per_min); })
        .style("fill","#460000");

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
      .text("Trade Volume");

      svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style("font-size","28px")
      .attr('class', 'chart-title')
      .text("Top 20 Countries by Trading per min");
      });
    
    }

}