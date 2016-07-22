console.log("Loading modules");

var restify = require('restify');
var program = require('commander');

var kuerime = require('..\\nlptosql\\kueri.me.js')({ server: 'http://vdigba:8043' });
var d3factory = require('..\\d3\\d3factory.js')();
var d3render = require('..\\d3render\\d3render.js')();

console.log("Parsing parameters");

program
  .version('0.0.1')
  .option('-p, --port <p>', 'Server port', 8080)
  .parse(process.argv);

 console.log("Port " + program.port);
  
 var Server = {
		home: {
			method: 'get',
			url: '/',
			handler: function(req, res, next) {
				res.send(Object.keys(Server).map(function(key){ return Server[key].url;}));
				next();
			}
		},
		kuerimeDBs:  {
			method: 'get',
			url: '/kuerime/databases',
			handler: function(req, res, next){
				kuerime.getUserDatabases(function(js){
					res.send(js);
					next();
				});
			}
		},
		kuerimeSuggest:  {
			method: 'get',
			url: '/suggest/:id/:message',
			handler: function(req, res, next){
				kuerime.getKeywordSuggestions(req.params.id, req.params.message, function(js){
					res.send(js);
					next();
				});
			}
		},
		kuerimeData:  {
			method: 'get',
			url: '/data/:id/:message',
			handler: function(req, res, next){
				var query = req.params.message;
				var id = req.params.id;
				kuerime.getKeywordSuggestions(id, query, function(js){
					var suggestion = js.suggests[0].s;
					kuerime.getResults(id, query, suggestion, function(js){
						js.query = query;
						js.suggestion = suggestion;
						res.send(js);
						next();
					});
				});
			}
		},
		kuerimeCube:  {
			method: 'get',
			url: '/cube/:id/:message',
			handler: function(req, res, next){
				var query = req.params.message;
				var id = req.params.id;
				kuerime.getKeywordSuggestions(id, query, function(js){
					var suggestion = js.suggests[0].s;
					kuerime.getCube(id, query, suggestion, function(js){
						js.query = query;
						js.suggestion = suggestion;
						res.send(js);
						next();
					});
				});
			}
		},
		kuerimeResults:  {
			method: 'get',
			url: '/chat/:id/:message/:chart',
			handler: function(req, res, next){
				var query = req.params.message;
				var id = req.params.id;
				kuerime.getKeywordSuggestions(id, query, function(js){
					var suggestion = js.suggests[0].s;
					kuerime.getResults(id, query, suggestion, function(js){
						// res.send({query: query, suggestion: suggestion, data: js});
						d3factory(js.data, function(svg){
							var body = "<html><head/><body>" + svg + "</body></html>";
							res.end(body);
						}, req.params.chart);
						next();
					});
				});
			}
		},
		d3test:  {
			method: 'get',
			url: '/d3/test/:data',
			handler: function(req, res, next){
				var data = req.params.data;
				if(data){
					data = JSON.parse(data);
				}
				d3factory(data, function(svg){
					var body = "<html><head/><body>" + svg + "</body></html>";
					res.end(body);
				});
			}
		},
		d3rendertest:  {
			method: 'get',
			url: '/d3/render',
			handler: function(req, res, next){
				d3factory(null, function(svg){
					d3render(svg, function(png){
						res.end(png);
					});
				});
			}
		},
		js: {
			method: 'get',
			url: '/js',
			handler: function(req, res, next){
				res.send({ 
					attributes:{
						'Dates':["2016-01-01","2016-01-02","2016-01-03","2016-01-04","2016-01-05","2016-01-06"]
					},
					metrics:{
						'Sales':[5, 20, 36, 10, 10, 20],
						'Cost':[7, 10, 6, 100, 30, 2],
						'Benefit':[-7, -10, -6, -100, -30, -2],
						'Margin':[-7, 3, 6, -10, -30, 2]
					}
				});
				next();
			}
		},
		end: {
			method: 'get',
			url: '/shutdown',
			handler: function(req, res, next){
				phantom.exit();
			}
		}
	};

console.log("Creating server");
var server = restify.createServer();

server.get(/\/html\/?.*/, restify.serveStatic({
  directory: process.cwd() + '\\..\\',
  default: 'bibotserver.js'
}));

Object.keys(Server)
	.map(function(key){
		var endpoint = Server[key];
		server[endpoint.method](endpoint.url, function(req, res, next){
			console.log(endpoint.method + ": " + endpoint.url);
			endpoint.handler(req, res, next);
		});
		
	})

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

server.listen(program.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
console.log("End");