let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req= new XMLHttpRequest()

let data
let values= []

let yScale 
let xScale
let xAxisScale
let yAxisScale


let height=600
let width=700
let padding= 40

let svg = d3.select('svg')

drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height', height)

}

drawBars = () => {

    let tooltip = d3.select('body')
    .append('div')
    .attr('id','tooltip')
    .style('visibility', 'hidden')
    .style('width','auto')
    .style('height','auto')



    svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class','bar')
    .attr('width', (width-(padding*2))/values.length)
    .attr('data-date', (item) => item[0])
    .attr('data-gdp', (item) => item[1])
    .attr('height', (item) => yScale(item[1]))
    .attr('x', (item, index) => xScale(index))
    .attr('y', (item)=> (height-padding) - yScale(item[1]))
    .on('mouseover' , (item) => {
        tooltip.transition().style("visibility", "visible")  
        tooltip.text(item[0])
        document.querySelector('#tooltip').setAttribute('data-date', item[0])
    })
    .on('mouseout',(item) => {
        tooltip.transition().style('visibility','hidden')
    })
    

}
generateScale = () => {
    yScale = d3.scaleLinear()
    .domain([0,d3.max(values,(item) => item[1])])
    .range([0, height - padding *2])

    xScale = d3.scaleTime()
    .domain([0, values.length - 1])
    .range([padding , width-(padding*2)])

    let dateArray = values.map((item) => {
        return new Date(item[0])
    });

    xAxisScale = d3.scaleTime()
    .domain([d3.min(dateArray), d3.max(dateArray)])
    .range([padding, width - padding*2])

    yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(values,(item) => item[1])])
    .range( [height - padding, padding] )
     
}

generateAxis = () => {

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis= d3.axisLeft(yAxisScale)

    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr("transform", "translate(0, " + (height - padding) + ")")
    

    svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr("transform", "translate("+ padding + ", 0)")
    
}

req.open('GET', url, true);
req.onload = () =>  {
    data = JSON.parse(req.responseText);
    values = data.data;
    drawCanvas();
    generateScale();
    drawBars();
    generateAxis();
};
req.send();