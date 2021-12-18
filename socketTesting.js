var stream = "@kline_30m";
var symbolStream = "btcusdt";
var streamName = [symbolStream+stream];
var W3CWebSocket = require('websocket').w3cwebsocket;
var socket = new W3CWebSocket("wss://stream.binance.com:9443/ws/"+streamName);
setInterval(function()
{
	var jsonMessage = {"method":"SUBSCRIBE","params":streamName,"id":1};
	var message = JSON.stringify(jsonMessage);
	if(socket.readyState===1){console.log('sending message');socket.send(message);}	
}, 30000);
socket.onopen = function(event) 
{	
	console.log('onopen');
	var date = new Date();
	console.log('socket state onopen '+socket.readyState+' '+date);
};
socket.onmessage = function (event)
{
	console.log('onmessage');
	var message = JSON.parse(event.data);
	var candle = Object(message.k);
	console.log(candle.c);
};