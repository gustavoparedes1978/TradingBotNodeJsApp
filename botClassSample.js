class Sample
{

	constructor(symbol) 
	{
		var lowestATR = 0;
		var lastBreakPoint = 0;
		var currentCloseTime = 0;
		var balance = 24.98;
		var lastBalance = 25;
		var buyOrders = [];
		var sellOrders = [];
		var numberAttempts = 0;
		var buyingAttempts = 0;
		var sellingAttempts = 0;
		var lastClosingPrice = 0;
		var readyForTrading = false;
		var isWinning = false;
				
		var divider = 256;
		var socket = {};
		
		var startWebSocket = function(){
			var stream = "@kline_30m";
			var symbolStream = "btcusdt";
			var streamName = [symbolStream+stream];
			var W3CWebSocket = require('websocket').w3cwebsocket;
			socket = new W3CWebSocket("wss://stream.binance.com:9443/ws/"+streamName);
							
			socket.onopen = function(event) 
			{
				var date = new Date();
				console.log('socket state onopen '+date+' '+symbol);
				isWinning = true;
				console.log(isWinning);
			};
			
			socket.onmessage = function(event) 
			{
				
				console.log('socket state onmessage '+date+' '+symbol);
				socket.close();
				var date = new Date();
				console.log('executing after close');
				
			};
			
			socket.onclose = function(event) 
			{
				var date = new Date();
				console.log('socket state onclose '+date+' '+symbol);
			};
		
			socket.onerror = function(error) 
			{
				var date = new Date(); 
				console.log('socket state onerror '+date+' '+symbol);
			};
		}
		startWebSocket();
		
		this.closeSocket = function()
			{
				socket.close();
			}
		
	}
	
	
}

var sample = new Sample('BTCUSDT');
var sampleArray = [];
sampleArray.push(sample);
/*
setTimeout(function(){
	
	sampleArray.forEach(function(item,index){	
		var currentS = Object(item);
		console.log(currentS);

		currentS.closeSocket();
		currentS = null;
		var botSample = new Sample('BTCUSDT');
		console.log(botSample);
		sampleArray.splice(0,1);
	});

},10000);
*/

var symbols = ['BTCUSDT','ETHUSDT'];
var ask = 'BTCUSDT';
symbols.forEach(function(item,index){
	var symbol = String(item);
	if(ask===symbol){symbols.splice(index,1);}
});

console.log(JSON.stringify(symbols));

