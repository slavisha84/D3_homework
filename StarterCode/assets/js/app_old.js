// The atempt to get this homework to work is inspired by
//studient activity located at 16-3-12 ("Pair_Hair_Metal_Conclusion").
//Majority code below is boiler code I used from activity with required edtits in order to 
//produce scatter chart that was requested in homework. 


// Setting up the position of the plot
var svgWd = 1024;
var svgHt = 660;
// Seeting up the margines within plot
var margin = {
    top: 25,
    right: 45,
    bottom: 75,
    left: 95
  };
  var width = svgWd - margin.left - margin.right;
  var height = svgHt - margin.top - margin.bottom;

// Creating SVG wrapper, appending SVG group to hold the chart and 
//shifting the latter by left and top margin.

var svg = d3
// I am using #scatter to produce scatter plot
  .select("#scatter")
  .append("svg")
  .attr("width", svgWd)
  .attr("height", svgHt);

// Appending SCG group
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initializing paramterers
// I am going to chose smokers and age since this has been problem in my family
// especially now after i visited Serbia
var chosexAxis = "age";

// I am going to use boiled code from student activity i mentioned above
// for the function which will ypdate x-scale var after click

function xScale(raw_data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(raw_data, d => d[chosenXAxis]) * 0.8,
        d3.max(raw_data, d => d[chosenXAxis]) * 1.3
      ]).range([0, width]);
    return xLinearScale;
  }

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1500)
      .call(bottomAxis);
    return xAxis;
  }

// I am using boler code again for function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {
    circlesGroup.transition()
      .duration(1000).attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
  }
//Retrieving data from CSV file
  d3.csv("raw_data.csv", function(err, raw_data) {
  if (err) throw err;

  // parsing data usinf foreach function to get the age and smokes data
  raw_data.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
  });

  // using boiler code from activitity to  create xLinearScale function above csv import
  var xLS = xScale(raw_data, chosenXAxis);

  // using boiler code from activitity to  create y scale function
  var yLS = d3.scaleLinear()
    .domain([0, d3.max(raw_data, d => d.smokes)])
    .range([height, 0]);

  // // using boiler code from activitity to create initial axis functions
  var bAxis = d3.axisBottom(xLS);
  var lAxis = d3.axisLeft(yLS);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(raw_data)
    .enter()
    .append("circle")
    .attr("cx", d => xLS(d[chosenXAxis]))
    .attr("cy", d => yLS(d.num_hits))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".7");
  });
