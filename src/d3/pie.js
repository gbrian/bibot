var d3 = require('d3');

module.exports = {
	css: '.bar rect {  fill: steelblue;}.bar text {  fill: #fff;  font: 10px sans-serif;}',
	build: function(wind3, data, settings){
		settings.width -= settings.margin.left - settings.margin.right,
		settings.height	-= settings.margin.top - settings.margin.bottom;
		var formatCount = d3.format(",.0f");
		
		var key = data.columns.filter(function(col){ return !col.drill})[0].name;
		var value = data.columns.filter(function(col){ return col.drill})[0].name;
		
		var bins = data.values.sort(d3.ascending).map(function(d){ return d[value]});
		
		var svg = wind3.select("body").append("svg")
			.attr("width", settings.width + settings.margin.left + settings.margin.right)
			.attr("height", settings.height + settings.margin.top + settings.margin.bottom)
		  .append("g")
			.attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");
		
		svg.selectAll('.arc')
	    		.data(d3.layout.pie()(bins))
	    		.enter()
	    		.append('path')
	    			.attr({
	    				'class':'arc',
	    				'd':arc,
	    				'fill':function(d,i){
	    					return colours[i];
	    				},
	    				'stroke':'#fff'
	    			});
	}
}