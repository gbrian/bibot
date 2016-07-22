var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var streamBuffers = require('stream-buffers');

var token = '259555022:AAHZbrVPH4JAI9jwXKXkvxxJqUGbFZQ0kr8';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
/*bot.onText(/(.*)/, function (msg, match) {
   var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
  
  var msg = match[1];
  var chatId = msg.chat.id;
  
});*/

// Any kind of message
bot.on('message', function (msg) {
	console.log(JSON.stringify(msg, null, 4));
	var chatId = msg.chat.id;
	var query = msg.text;
	var url = "http://localhost:9900/api/chat?cube=3&query=" + query;
	console.log("BiBOT: " + url);
	request.get(url, function(error, response, image){
		console.log("Image back! " + error);
		var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
		  frequency: 10,       // in milliseconds.
		  chunkSize: 2048     // in bytes.
		}); 
		myReadableStreamBuffer.put(image, 'base64');
		bot.sendPhoto(chatId, new Buffer(image, 'base64'), {caption: 'BiBOT'});
  });  
});
console.log("Ready to chat!");