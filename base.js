document.addEventListener("DOMContentLoaded", function() {

    const req = new XMLHttpRequest();
    req.open("Get", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    req.send();
    req.onload = () => {
        const json = JSON.parse(req.responseText);

        const minY = d3.min(json.data, d=> d[1]);
        const maxY = d3.max(json.data, d=> d[1]);
        const maxX = d3.max(json.data, (d, i) => i)

        const h = 600
        const w = 1000
        const padding = 80
        const gdpScale = d3.scaleLinear()
        .range([padding, h - padding])
        .domain([0, maxY]) 
        const yAxis = d3.axisLeft(gdpScale)

        // defining x axis / scale
        let maxDate =  new Date(json.data[json.data.length - 1][0])
        let minDate = new Date (json.data[0][0])
        var xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([padding, w - padding])
        const xAxis = d3.axisBottom(xScale)

        // adding svg to body
        const svg = d3.select('body').
        append('svg').
        attr("width", w).
        attr("height", h);

        // adding rectangles, with class bar
        svg.selectAll('rect')
        .data(json.data)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr('x', (d, i) => xScale(new Date (d[0])))
        .attr('y', (d, i) => h - gdpScale(d[1]))
        .attr("height", (d, i) => gdpScale(d[1]) - padding)
        .attr("width", (d, i) => ( w - 2 * padding)/maxX)
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])

        // adding x-axis to graph
        svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0" + ", " + (h - padding) + ")")
        .call(xAxis);

        // adding y-axis to graph
        svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", " translate(" + (padding) + ", " + (h) + ") scale(1, -1)")
        .call(yAxis)

        // adding a tooltip div to the body
        var tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")

        // creating event listeners for "rect" elements
        // these listeners update the tooltip div
        svg.selectAll("rect")
        .on("mouseover", (d, i) => {
            tooltip.style("visibility", "visible")
            .html(`$${d[1].toLocaleString()} Billion <br> ${d[0]}`)
            .style("left", (xScale(new Date (d[0]))+ "px"))
            .style("top", "500px")
            .attr("data-date", d[0])
        })
        .on("mouseout", d => {
            tooltip.style("visibility", "hidden")
        })

    }
})
