// The atempt to get this homework to work is inspired by
//studient activity located at 16-3-12 ("Pair_Hair_Metal_Conclusion").
//Majority code below is boiler code I used from activity with required edtits in order to 
//produce scatter chart that was requested in homework. 


// Setting up the position of the plot
var svgWidth = 1024;
var svgHeight = 660;
// Seeting up the margines within plot
var margin = {
    top: 25,
    right: 45,
    bottom: 150,
    left: 95
  };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

// Creating SVG wrapper, appending SVG group to hold the chart and 
//shifting the latter by left and top margin.

var svg = d3
// I am using #scatter to produce scatter plot
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params - Poverty
var chosenXAxis = "poverty";

// I am going to use boiled code from student activity i mentioned above
// for the function which will ypdate x-scale var after click
function xScale(raw_data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(raw_data, d => d[chosenXAxis]) * .8,
        d3.max(raw_data, d => d[chosenXAxis]) * 1]).range([0, width]);
    return xLinearScale;
  }
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale); 
    xAxis.transition()
      .duration(2000)
      .call(bottomAxis);
   return xAxis;
  }

// I am using boler code again for function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {
    circlesGroup.transition().duration(3000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
  }

// I am agina using boiler code from the activity for Switch function used for updating circles group with new tooltip

function updateToolTip(chosenXAxis, circlesGroup) {
  switch(chosenXAxis) {
    case 'poverty':
     var label = "Poverty:";
      break;
    case 'healthcare':
      var label = "Healthcare";
      break;
    default:
  }
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) { 
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      //following the boiler code and  using function to address onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    return circlesGroup;
  }

// utlizie d3.csv library to retrieve the data from csv.

d3.csv("raw_data.csv", function(err, raw_data) {
  if (err) throw err;
// check the console log
  console.log(raw_data)

// parsing data usinf foreach function to get the povertry, healthcre and obesity data
  raw_data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
  });

   // using boiler code from activitity to  create xLinearScale function above csv import
   var xLinearScale = xScale(raw_data, chosenXAxis);
   // using boiler code from activitity to  create y scale function
  var yLinearScale = d3.scaleLinear().domain([0, d3.max(raw_data,d => d.obesity)]).range([height, 0]);
  // using boiler code from activitity to  create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

   // following the bolier code i will be appending x axis using xAxis variable
   var xAxis = chartGroup.append("g")
   .classed("x-axis", true)
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis);

   // append y axis
  chartGroup.append("g")
  .call(leftAxis);

// append initial circles using raw_data
  var circlesGroup = chartGroup.selectAll("circle")
    .data(raw_data)
    .enter()
    .append("circle")
    .attr("cx", d => (d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", 15)
    .attr("fill", "blue");

 // Based on boiler code from activity  I will create group for  2 x- axis labels

 var labelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 30})`);
 var poverty_label = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 30)
 // these are the values (poverty ad healthcare) to take for event listener
 .attr("value", "poverty") 
 .classed("active", true)
 .text("Poverty"); 
 var healthcare_label = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 45)
 //idetinfying  value to get for event listener
 .attr("value", "healthcare")
 .classed("inactive", true)
 .text("Healtchare:");

//Based on boiler code from activity I am going to append y axis
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Number of Obese:");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
// x axis labels event listener
labelsGroup.selectAll("text")
.on("click", function() {
  // get selected value
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {
    // we are replacing chosenXAxis with value
    chosenXAxis = value;


    // updating x scales with new data
    xLinearScale = xScale(raw_data, chosenXAxis);
    // updating x axis
    xAxis = renderAxes(xLinearScale, xAxis);
    // I am going to update circles with new value asigned to x
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
    // I am upating tooltips with new values
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    // In order to change bold text i will use boiler code from activity for switch function and use classes
    switch(chosenXAxis) {
      case 'poverty':
        poverty_label
          .classed("active", true)
          .classed("inactive", false);
        healthcare_label
          .classed("active", false)
          .classed("inactive", true);
        break;
      case 'healthcare':
        healthcare_label
          .classed("active", true)
          .classed("inactive", false);
        poverty_label
          .classed("active", false)
          .classed("inactive", true);
        break;
    }
  }
});
});