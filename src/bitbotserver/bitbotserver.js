var restify = require('restify');
var program = require('commander');

var kuerime = require('..\\nlptosql\\kueri.me.js')({ server: 'http://vdigba:8043' });

program
  .version('0.0.1')
  .option('-p, --port <p>', 'Server port', 8080)
  .parse(process.argv);

 Server =
	{
		test: function(req, res, next) {
			res.send('hello there!');
			next();
		},
		getMessage: function(req, res, next) {
			var msg = req.params.message;
			res.send('Received: ' + msg);
			next();
		},
		kuerimeDBs: function(req, res, next){
			kuerime.getUserDatabases(function(js){
				res.send(js);
				next();
			});
		},
		kuerimeSuggest: function(req, res, next){
			kuerime.getKeywordSuggestions(4, req.params.message, function(js){
				res.send(js);
				next();
			});
		},
		kuerimeResults: function(req, res, next){
			kuerime.getKeywordSuggestions(4, req.params.message, function(js){
				kuerime.getResults(4, req.params.message, js.suggests[0].s, function(js){
					res.send(js);
					next();
				});
			});
		},
	}

var server = restify.createServer();
server.get('/', Server.test);
server.get('/suggest/:message', Server.kuerimeSuggest);
server.get('/chat/:message', Server.kuerimeResults);
server.get('/kuerime/databases', Server.kuerimeDBs);
// server.post('/chat/:message', Server.postMessage);

server.listen(program.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});