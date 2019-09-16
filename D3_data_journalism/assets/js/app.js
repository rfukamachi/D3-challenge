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
function xScaleThis(acsTable, chosenXAxis) {
    // create x scale:
    let xLinearScale = d3.scaleLinear()
                         .domain([d3.min(acsTable, data => data[chosenXAxis]) * 0.95,
                                  d3.max(acsTable, data => data[chosenXAxis]) * 1.05])
                         .range([0, chartWidth]);
    return xLinearScale;
}

// Function: To update y scale upon axis label clicking:
function yScaleThis(acsTable, chosenYAxis) {
    // create y scale:
    let yLinearScale = d3.scaleLinear()
                         .domain([d3.min(acsTable, data => data[chosenYAxis]) * 0.8,
                                  d3.max(acsTable, data => data[chosenYAxis]) * 1.2])
                         .range([chartHeight, 0]);
    return yLinearScale;
}


// Function: To update x Axis when a new axis label is clicked:
function renderXAxes(newXScale, xAxis, bottomAxis) {
    bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
         .duration(1000)
         .call(bottomAxis);
    
    return xAxis;
}


// Function: To update y Axis when a new axis label is clicked:
function renderYAxes(newYScale, yAxis, leftAxis) {
    leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
         .duration(1000)
         .call(leftAxis);
    
    return yAxis;
}


//Function: To update circle group when a new x Axis is selected:
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
                .duration(1000)
                .attr('cx', d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}


//Function: To update circle group when a new y Axis is selected:
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
                .duration(1000)
                .attr('cy', d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}


//Function: To update text group when a new x Axis is selected:
function renderXtexts(textGroup, newXScale, chosenXAxis) {
    textGroup.transition()
             .duration(1000)
             .attr('dx', d => newXScale(d[chosenXAxis])-8);
    return textGroup;
}


//Function: To update text group when a new x Axis is selected:
function renderYtexts(textGroup, newYScale, chosenYAxis) {
    textGroup.transition()
             .duration(1000)
             .attr('dy', d => newYScale(d[chosenYAxis])+5);
    return textGroup;
}


// Function: To update circles group with new tooltip:
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    let xlabel = 'Poverty:';
    let ylabel = 'Healthcare:';
    let xPostfix = '%';
    let yPostfix = '%';

    switch(chosenXAxis) {
        case 'poverty'      : xlabel = 'Poverty:'; break;
        case 'age'          : xlabel = 'Age:'; break;
        case 'income'       : xlabel = 'Income:'; break;
    }

    switch(chosenYAxis) {
        case 'obesity'      : ylabel = 'Obesity:'; break;
        case 'smokes'       : ylabel = 'Smokes:'; break;
        case 'healthcare'   : ylabel = 'Healthcare:'; break;
    }

    switch(chosenXAxis) {
        case 'poverty'      : xPostfix = '%'; break;
        case 'age'          : xPostfix = ''; break;
        case 'income'       : xPostfix = ''; break;
    }
    
    // initialize toolTip:
    let toolTip = d3.tip()
                    .attr('class', 'd3-tip')
                    .direction('w')
                    .html(function(d) {                  
                        return (`<strong>${d.state}</strong><br>
                                 ${xlabel} ${d[chosenXAxis]}${xPostfix}<br>
                                 ${ylabel} ${d[chosenYAxis]}${yPostfix}`);
                    });

    // create the tooltip in chartGroup:
    circlesGroup.call(toolTip);

    // create mouseover and mouseout event listeners to display tooltip:
    circlesGroup.on('mouseover', toolTip.show)
                .on('mouseout', toolTip.hide);

    return circlesGroup;
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

    // append y axis:
    let yAxis = chartGroup.append('g')
                          .call(leftAxis);

    // plot the chart:
    let circlesGroup = chartGroup.selectAll('circle')
                                 .data(acsTable)
                                 .enter()
                                 .append('circle')
                                 .attr('cx', d => xLinearScale(d[chosenXAxis]))
                                 .attr('cy', d => yLinearScale(d[chosenYAxis]))
                                 .attr('r', 12)
                                 .attr('fill', 'lightblue');

    // add the plot labels:                            
    let textGroup = chartGroup.selectAll('circleLabel')
                              .data(acsTable)
                              .enter()
                              .append('text')
                              .attr('dx', d => xLinearScale(d[chosenXAxis])-8)
                              .attr('dy', d => yLinearScale(d[chosenYAxis])+5)
                              .attr('font-size', 11)
                              .attr('font-weight', 'bold')
                              .attr('fill', 'white')
                              .text(function(d) {return d.abbr});
    
    // add x axis label group:
    let xLabelGrp = chartGroup.append('g')
                                .attr('transform', `translate(${chartWidth/2}, ${chartHeight+20})`)

    let povertyLabel = xLabelGrp.append('text')
                                    .attr('x', 0)
                                    .attr('y', 20)
                                    .attr('value', 'poverty')
                                    .classed('active', true)
                                    .text('In Poverty (%)');
    
    let ageLabel = xLabelGrp.append('text')
                                .attr('x', 0)
                                .attr('y', 40)
                                .attr('value', 'age')
                                .classed('inactive', true)
                                .text('Age (Median)');
    
    let incomeLabel = xLabelGrp.append('text')
                            .attr('x', 0)
                            .attr('y', 60)
                            .attr('value', 'income')
                            .classed('inactive', true)
                            .text('Household Income (Median)');
    
    // add y axis label group:
    let yLabelGrp = chartGroup.append('g')

    let healthcareLabel = yLabelGrp.append('text')
                                    .attr('transform', 'rotate(-90)')
                                    .attr('y', 0 - margin.left)
                                    .attr('x', 0 - (chartHeight/2))
                                    .attr('dy', '3em')
                                    .attr('value', 'healthcare')
                                    .classed('active', true)
                                    .classed('axis-text', true)
                                    .text('Lacks Healthcare (%)');    

    let smokesLabel = yLabelGrp.append('text')
                                .attr('transform', 'rotate(-90)')
                                .attr('y', 0 - margin.left)
                                .attr('x', 0 - (chartHeight/2))
                                .attr('dy', '2em')
                                .attr('value', 'smokes')
                                .classed('inactive', true)
                                .classed('axis-text', true)
                                .text('Smokes (%)');

    let obesityLabel = yLabelGrp.append('text')
                               .attr('transform', 'rotate(-90)')
                               .attr('y', 0 - margin.left)
                               .attr('x', 0 - (chartHeight/2))
                               .attr('dy', '1em')
                               .attr('value', 'obesity')
                               .classed('inactive', true)
                               .classed('axis-text', true)
                               .text('Obese (%)');
    

    // Initialize the tooltips:
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


    /******************************************************/
    //x axis labels event listener:
    /******************************************************/
    xLabelGrp.selectAll('text')
             .on('click', function() {

                let currentX = d3.select(this).attr('value');
                
                if (currentX !== chosenXAxis) {
                    //replace x axis:
                    chosenXAxis = currentX;

                    //call the function to scale the x axis:
                    xLinearScale = xScaleThis(acsTable, chosenXAxis);
                    
                    //update x axis:
                    xAxis = renderXAxes(xLinearScale, xAxis, bottomAxis);

                    //update circle group:
                    circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

                    //upate text group:
                    textGroup = renderXtexts(textGroup, xLinearScale, chosenXAxis);

                    //update tooltip:
                    updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    //change the active x Axis label:
                    switch(chosenXAxis) {
                        case 'poverty': 
                            povertyLabel.classed('active', true)
                                        .classed('inactive', false);
                            ageLabel.classed('active', false)
                                    .classed('inactive', true);
                            incomeLabel.classed('active', false)
                                       .classed('inactive', true);
                            break;
                        case 'age':
                            ageLabel.classed('active', true)
                                    .classed('inactive', false);
                            povertyLabel.classed('active', false)
                                    .classed('inactive', true);
                            incomeLabel.classed('active', false)
                                       .classed('inactive', true);
                            break;
                        case 'income':
                            incomeLabel.classed('active', true)
                                       .classed('inactive', false);
                            ageLabel.classed('active', false)
                                    .classed('inactive', true);
                            povertyLabel.classed('active', false)
                                        .classed('inactive', true);
                            break;
                        default: 
                            povertyLabel.classed('active', true)
                                        .classed('inactive', false);
                            ageLabel.classed('active', false)
                                    .classed('inactive', true);
                            incomeLabel.classed('active', false)
                                       .classed('inactive', true);
                            break;
                    }
                }

             });
       

    /******************************************************/         
    //y axis labels event listener:
    /******************************************************/
    yLabelGrp.selectAll('text')
            .on('click', function() {
                
                let currentY = d3.select(this).attr('value');

                if (currentY !== chosenYAxis) {
                    //replace y axis:
                    chosenYAxis = currentY;

                    //call the function to scale the y axis:
                    yLinearScale = yScaleThis(acsTable, chosenYAxis);
                    
                    //update y axis:
                    yAxis = renderYAxes(yLinearScale, yAxis, leftAxis);

                    //update circle group:
                    circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

                    //upate text group:
                    textGroup = renderYtexts(textGroup, yLinearScale, chosenYAxis);

                    //update tooltip:
                    updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    //change the active y Axis label:
                    switch(chosenYAxis) {
                        case 'healthcare':
                            healthcareLabel.classed('active', true)
                                            .classed('inactive', false);
                            smokesLabel.classed('active', false)
                                        .classed('inactive', true);
                            obesityLabel.classed('active', false)
                                        .classed('inactive', true);
                            break;
                        case 'smokes':
                            smokesLabel.classed('active', true)
                                        .classed('inactive', false);
                            obesityLabel.classed('active', false)
                                        .classed('inactive', true);
                            healthcareLabel.classed('active', false)
                                            .classed('inactive', true);
                            break;
                        case 'obesity': 
                            obesityLabel.classed('active', true)
                                        .classed('inactive', false);
                            healthcareLabel.classed('active', false)
                                            .classed('inactive', true);
                            smokesLabel.classed('active', false)
                                        .classed('inactive', true);
                            break;
                        
                        default: 
                            healthcareLabel.classed('active', true)
                                           .classed('inactive', false);
                            obesityLabel.classed('active', false)
                                        .classed('inactive', true);
                            smokesLabel.classed('active', false)
                                       .classed('inactive', true);
                            break;
                    }           
                
                }
            });             
});




