var d3 = require('d3');

module.exports = {
	css: '.bar rect {  fill: steelblue;}.bar text {  fill: #fff;  font: 10px sans-serif;}',
	build: function(wind3, data, settings){
		//settings.width -= settings.margin.left - settings.margin.right,
		//settings.height	-= settings.margin.top - settings.margin.bottom;
		var formatCount = d3.format(",.0f");
		var svgWidth = settings.width + settings.margin.left + settings.margin.right;
		var svgHeight = settings.height + settings.margin.top + settings.margin.bottom;
		
		var key = data.columns.filter(function(col){ return !col.drill})[0].name;
		var value = data.columns.filter(function(col){ return col.drill})[0].name;
		
		var bins = data.values.sort(d3.ascending);
		var minMax = [d3.min(bins, function(d) { return d[key]; }), d3.max(bins, function(d) { return d[key]; })];
		var fillInc = (255 / (minMax[1] - minMax[0]));
		
		var x = d3.scaleTime()
			.domain(minMax)
			.rangeRound([0, settings.width]);
		var axisx = d3.axisBottom(x);
		
		var y = d3.scaleLinear()
			.range([settings.height, 0]);

		var svg = wind3.select("body").append("svg")
			.attr("width", svgWidth)
			.attr("height", svgHeight)
		  .append("g")
			.attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");

		var xwidth = svg.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + settings.height + ")")
			.call(axisx)
			.style("width");
		
		console.log(xwidth);
			
		var barWidth = (xwidth / data.values.length) - 2;
		y.domain([0, d3.max(bins, function(d) { return d[value]; })]);

		var bar = svg.selectAll(".bar")
		  .data(bins)
		  .enter().append("g")
		  .attr("class", "bar")
		  .attr("transform", function(d) { return "translate(" + x(d[key]) + "," + y(d[value]) + ")"; });

		bar.append("rect")
			.attr("x", 1)
			.attr("width", function(d, i){ 
				return 10;
				return (i == 0 ? x(d[key]): (x(d[key]) - x(bins[i-1][key])) / 2);
			})
			.attr("height", function(d) { return settings.height - y(d[value]); })
			.attr("fill", function(d) {
				return "rgb(0, 0, " + (d[value] * fillInc) + ")";
			});

		bar.append("text")
		  .attr("dy", ".75em")
		  .attr("y", 6)
		  .attr("x", function(d) { return barWidth / 2; })
		  .attr("text-anchor", "middle")
		  .text(function(d) { return formatCount(d[value]); });
	}
}