"use strict";
var webpage = require('webpage');
var server = require('webserver').create();
var system = require('system');
var fs = require('fs');

var settings = {
	port: null,
	dataServer: null
}


function parseGET(request){
  // adapted from http://stackoverflow.com/a/8486188
  var url = request.url;
  var index = url.indexOf("?");
  var query = url.substr(index + 1);
  var result = {
	  server: "http://" + (request.headers.Host || request.headers.host || "localhost"),
	  path: index == -1 ? url: url.substr(0, index)
  };
  query.split("&").forEach(function(part) {
    var e = part.indexOf("=")
    var key = part.substr(0, e);
    var value = part.substr(e+1);
    result[key] = unescape(decodeURIComponent(value));
  });
  return result;
}

function createPage(){
	var page = webpage.create();
	page.onConsoleMessage = function(msg, lineNum, sourceId) {
	  console.log('PAGE CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
	};
	return page;
}

if (system.args.length !== 3) {
    console.log('Usage: server.js <some port> <data server>');
    phantom.exit(1);
} else {
    settings.port = system.args[1];
	console.log("Serving in http://localhost:" + settings.port)
	settings.dataServer = system.args[2];
	console.log("Data server: " + settings.dataServer);
    
	var listening = server.listen(settings.port, function (request, response) {
        // console.log("GOT HTTP REQUEST");
        console.log(JSON.stringify(request, null, 4));
		var parts = request.url.split('?');
		
		var url = parseGET(request);
		
		response.statusCode = 200;
        response.headers = {"Cache": "no-cache", "Content-Type": "text/html"};
		console.log(JSON.stringify(url));
		if(url.path.indexOf("/api/data") == 0){
			var page = createPage();
			var dataUrl = settings.dataServer + "/cube/" + url.cube  + "/" + url.query;
			console.log("Opening " + dataUrl);
			page.open(dataUrl, function (status) {
				
				response.setHeader("Content-Type", "application/json");
				var json = page.plainText;
				console.log("Receiving from data server: " + status + " " + json);
				response.write(json);
				response.close();
			});
		}else if(url.path.indexOf("/api/chat") == 0){
			var page = createPage();
			var pageUrl = url.server + "/echarttest.html?cube=" + url.cube + "&query=" + url.query;
			console.log("Opening " + pageUrl);
			page.open(pageUrl, function (status) {
				if (status !== 'success') {
					console.log('FAIL to load the address');
					response.close();
				} else {
					setTimeout(function() {
						console.log("Returning HTML from phantom.js:");
						// response.write(page.content);
						if(url.format == "html")
							response.write('<img src="data:image/png;base64,' + page.renderBase64("PNG") + '"/>');
						else{
							//response.setHeader("Content-Type", "image/png");
							response.write(page.renderBase64("PNG"));
						}
						page.close();
						response.close();
					}, 5000)
				}
			});	
		}else{
			var file = fs.open(url.path.substring(1), 'r');
			var html = file.read();
			response.write(html);
			file.close();
			response.close();
		}
    });
    if (!listening) {
        console.log("could not create web server listening on port " + port);
        phantom.exit();
    }
    /*
	var page = webpage.create();
	var url = "http://localhost:" + port + "/foo/bar.php?asdf=true";
    console.log("SENDING REQUEST TO:");
    console.log(url);
    page.open(url, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
        } else {
            console.log("GOT REPLY FROM SERVER:");
            console.log(page.content);
        }
        phantom.exit();
    });
	*/
}