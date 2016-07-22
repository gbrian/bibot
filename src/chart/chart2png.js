var phantom = require('phantom');

var ChartToPNG = function(data, callback){


var sitepage = null;
var phInstance = null;
phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
		page.onConsoleMessage = function (msg, line, source) { console.log('console> ' + msg); };
        sitepage = page;
		page.includeJs(
		  // Include the https version, you can change this to http if you like.
		  'http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js',
		  function() {
			(page.evaluate(function() {
			  console.log($);
			}))
		  }
		);
        // return page.open('https://stackoverflow.com/');
		return page.setContent('<html><head><script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script><script>console.log($)</script></head><body></body></html>', '');
    })
	.then(status => {
		sitepage.libraryPath = __dirname;
        return sitepage.injectJs('jquery.min.js');
    })
	.then(status => {
        //return sitepage.evaluate(function(){ console.log($)});
    })
    .then(status => {
        return sitepage.property('content');
    })
    .then(content => {
        callback(content);
        sitepage.close();
        phInstance.exit();
    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });
return;

var phantomJS = {
	sitepage: null,
	instance: null
}

phantom.create()
    .then(instance => {
        phantomJS.instance = instance;
        return instance.createPage();
    })
    .then(page => {
		page.onConsoleMessage = function (msg, line, source) { console.log('console> ' + msg); };
		phantomJS.sitepage = page;
		// phantomJS.sitepage.libraryPath = __dirname;
		var expectedContent = '<html><head/><body></body></html>';
		phantomJS.sitepage.setContent(expectedContent, "", function(){
			console.log("Content set!");
			callback("Phase 1 content: " + phantomJS.sitepage.content);
		});
		callback("Phase 2 content: " + phantomJS.sitepage.content);
	})
	.then(success => {
		console.log("Open blank");
		phantomJS.sitepage.open('about:blank', function(status) {
			console.log("Blank opened");
			if(phantomJS.sitepage.injectJs("jquery.min.js") &&
			phantomJS.sitepage.injectJs("echarts.min.js")){
				console.log("Scripts injected");
				phantomJS.sitepage.evaluate(function() {
					console.log(jQuery);	
				});
			}
		});
	})
	.then(success => {
		console.log("Adding js from: " + phantomJS.sitepage.libraryPath);
		if(true){
			
			return phantomJS.sitepage.evaluate(function(){
				var a = echarts.init;
				var body = jQuery('body');
				body.append('<h3 class="title"/>').text(data.query);
				body.append('<h4 class="subtitle"/>').text(data.suggestion);
				var main = body.append('<div id="main" style="width: 600px;height:400px;"></div>');
				// based on prepared DOM, initialize echarts instance
				var myChart = echarts.init(main[0]);
				
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
				// use configuration item and data specified to show chart
				myChart.setOption(option);
			});
		}else{
			throw "Error adding scripts";
		}
	})
    .then(content => {
		console.log("Content done");
        // callback("data:image/png;base64," + phantomJS.sitepage.renderBase64("PNG"));
		callback(phantomJS.sitepage.content);
        phantomJS.sitepage.close();
    })
    .catch(error => {
		callback(error);
        console.log(error);
    })
	.then(() => {
		phantomJS.instance.exit();
	});
}

module.exports = ChartToPNG;