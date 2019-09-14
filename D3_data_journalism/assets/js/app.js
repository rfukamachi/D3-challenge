/**********************************************************************/
// CHART DEFINITIONS:
/**********************************************************************/

// Canvas Dimensions:
const svgWidth = 960;
const svgHeight = 500;

// Margin Definitions:
const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Chart Dimensions:
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// SVG Wrapper:
let svg = d3.select('#scatter')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

// Append an SVG group:
let chartGroup = svg.append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);

                    
/**********************************************************************/
// Initialize Parameters:
/**********************************************************************/
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


/**********************************************************************/
// FUNCTION DEFINITIONS:
/**********************************************************************/

// Function: To update x scale upon axis label clicking:
function xScaleThis(acs2014, chosenXAxis) {
    // create x scale:
    let xLinearScale = d3.scaleLinear()
                         .domain([d3.min(acs2014, data => data[chosenXAxis]) * 0.8,
                                  d3.max(acs2014, data => data[chosenXAxis]) * 1.2])
                         .range([0, chartWidth]);
    return xLinearScale;
}

// Function: To update y scale upon axis label clicking:
function yScaleThis(acs2014, chosenYAxis) {
    // create y scale:
    let yLinearScale = d3.scaleLinear()
                         .domain([0,     //d3.min(acs2014, data => data[chosenYAxis]) * 0.8,
                                  d3.max(acs2014, data => data[chosenYAxis]) * 1.2])
                         .range([chartHeight, 0]);
    return yLinearScale;
}






/**********************************************************************/
// Pull data from the CSV file:
// d3.csv('url of csv from index.html point of view', conversion functions, callback function)
/**********************************************************************/
d3.csv('/assets/data/data.csv').then(function(acsTable, error) {
    
    // throw the error because we can't proceed otherwise:
    if (error) return console.warn(error);
    // console.log(error);
    // console.log(typeof(acsTable));

    // convert strings to numbers for numeric values:
    acsTable.forEach(function(data) {
        //use shorthand for parseInt:
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        // console.log('poverty: ', data.poverty);
    });

    
    // call the ScaleThis functions for the csv file:
    let xLinearScale = xScaleThis(acsTable, chosenXAxis);
    let yLinearScale = yScaleThis(acsTable, chosenYAxis);

    // create inital axis functions:
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append x axis:
    let xAxis = chartGroup.append('g')
                          .classed('x-axis', true)
                          .attr('transform', `translate(0, ${chartHeight})`)
                          .call(bottomAxis);






    // acsTable.state = 
    // acsTable.abbr    
    


    // console.log(acsTable.poverty);
});



// console.log(`${chartGroup}`)

