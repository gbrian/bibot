var d3 = require('d3');

module.exports = {
	css: '.bar rect {  fill: steelblue;}.bar text {  fill: #fff;  font: 10px sans-serif;}',
	build: function(wind3, data, settings){
		var dateKey = data.columns.filter(function(col){ return col.valueType == "date"})[0].name;
		var formatCount = d3.format(",.0f");

		settings.width -= settings.margin.left - settings.margin.right,
		settings.height	-= settings.margin.top - settings.margin.bottom;
		
		var minDate = new Date(data.values[0][dateKey].getTime()), 
			maxDate = new Date(data.values[0][dateKey].getTime());
		data.values.map(function(d){
			if(d[dateKey].getTime() < minDate.getTime())
				minDate.setTime(d[dateKey].getTime() - (48 * 60 * 60 * 1000));
			else if(d[dateKey].getTime() > maxDate.getTime())
				maxDate.setTime(d[dateKey].getTime() + (48 * 60 * 60 * 1000));
		});
		console.log(minDate.toString());
		console.log(maxDate.toString());
		var x = d3.scaleTime()
			.domain([new Date(minDate), new Date(maxDate)])
			.rangeRound([0, settings.width]);

		var y = d3.scaleLinear()
			.range([settings.height, 0]);

		var histogram = d3.histogram()
			.value(function(d) { return new Date(d[dateKey]); })
			.domain(x.domain())
			.thresholds(x.ticks(d3.timeWeek));

		var svg = wind3.select("body").append("svg")
			.attr("width", settings.width + settings.margin.left + settings.margin.right)
			.attr("height", settings.height + settings.margin.top + settings.margin.bottom)
		  .append("g")
			.attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");

		svg.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + settings.height + ")")
			.call(d3.axisBottom(x));

		var bins = histogram(data.values);
		//console.log(data[0]);
		console.log(bins);
		
		y.domain([0, d3.max(bins, function(d) { return d.length; })]);

		var bar = svg.selectAll(".bar")
		  .data(bins)
		  .enter().append("g")
		  .attr("class", "bar")
		  .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

		bar.append("rect")
		  .attr("x", 1)
		  .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
		  .attr("height", function(d) { return settings.height - y(d.length); });

		bar.append("text")
		  .attr("dy", ".75em")
		  .attr("y", 6)
		  .attr("x", function(d) { return (x(d.x1) - x(d.x0)) / 2; })
		  .attr("text-anchor", "middle")
		  .text(function(d) { return formatCount(d.length); });
	}
};