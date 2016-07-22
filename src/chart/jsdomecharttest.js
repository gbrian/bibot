var echart = require('echarts');
var jsdom = require('jsdom');

var data = 
		{ 
			attributes:{
				'Dates':["2016-01-01","2016-01-02","2016-01-03","2016-01-04","2016-01-05","2016-01-06"]
			},
			metrics:{
				'Sales':[5, 20, 36, 10, 10, 20],
				'Cost':[7, 10, 6, 100, 30, 2],
				'Benefit':[-7, -10, -6, -100, -30, -2],
				'Margin':[-7, 3, 6, -10, -30, 2]
			}
		};

jsdom.env(
  '<div id="chart" witdh="600" height="400">',
  ["http://code.jquery.com/jquery.js"],
  function (err, window) {
	console.log("Page loaded");
	document = window.document;
	var jChart = window.$("#chart");
	var myChart = echart.init(jChart.get(0));
	console.log("Chart initialized");
	
	// specify chart configuration item and data
	var option = {
		legend: {
			data: Object.keys(data.metrics)
		},
		xAxis: {
			name: 'Xaxis',
			data: data.attributes.Dates
		},
		yAxis: {},
		series: Object.keys(data.metrics)
					.map(function(metric, i){
						return {
							name: metric,
							type: i % 2 == 0 ? 'bar': 'line',
							label:{
							  normal:{
								  show:true
							  }  
							},
							data: data.metrics[metric]
						}
					})
	};
	console.log(option);
	// use configuration item and data specified to show chart
	myChart.setOption(option);
	// Return html
	console.log(jChart.html());
  }
);