var restify = require('restify');
var program = require('commander');

var kuerime = require('..\\nlptosql\\kueri.me.js')({ server: 'http://vdigba:8043' });
var d3factory = require('..\\d3\\d3factory.js')();
var d3render = require('..\\d3render\\d3render.js')();

program
  .version('0.0.1')
  .option('-p, --port <p>', 'Server port', 8080)
  .parse(process.argv);

 Server =
	{
		test: function(req, res, next) {
			console.log("GET test");
			res.send('hello there!');
			next();
		},
		getMessage: function(req, res, next) {
			console.log("GET getMessage");
			var msg = req.params.message;
			res.send('Received: ' + msg);
			next();
		},
		kuerimeDBs: function(req, res, next){
			console.log("GET kuerimeDBs");
			kuerime.getUserDatabases(function(js){
				res.send(js);
				next();
			});
		},
		kuerimeSuggest: function(req, res, next){
			console.log("GET kuerimeSuggest");
			kuerime.getKeywordSuggestions(req.params.id, req.params.message, function(js){
				res.send(js);
				next();
			});
		},
		kuerimeResults: function(req, res, next){
			console.log("GET kuerimeResults");
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
		},
		d3test: function(req, res, next){
			console.log("GET d3test");
			var data = req.params.data;
			if(data){
				data = JSON.parse(data);
				console.log(data);
			}
			d3factory(data, function(svg){
				var body = "<html><head/><body>" + svg + "</body></html>";
				res.end(body);
			});
		},
		d3rendertest: function(req, res, next){
			console.log("GET d3rendertest");
			d3factory(null, function(svg){
				d3render(svg, function(png){
					res.end(png);
				});
			});
		}
	}

var server = restify.createServer();
server.get('/', Server.test);
server.get('/suggest/:id/:message', Server.kuerimeSuggest);
server.get('/chat/:id/:message/:chart', Server.kuerimeResults);
server.get('/kuerime/databases', Server.kuerimeDBs);
server.get('/d3/test/:data', Server.d3test);
server.get('/d3/render', Server.d3rendertest);
// server.post('/chat/:message', Server.postMessage);

server.listen(program.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});