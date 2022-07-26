var getListenKey = async function()
{		
	const myPromise = new Promise(function(resolve, reject) 
		{
			var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
			var xhttpRequest = new XMLHttpRequest();

			xhttpRequest.onerror = function(error)
				{
					console.log('onerror');
				};
			
			xhttpRequest.onreadystatechange = function() 
				{
					if (this.readyState === 4 && this.status === 200) 
						{
							var response = this.responseText;
							console.log(response);
							resolve(response);
						}
				};
			xhttpRequest.open("GET", "http://localhost:8091/tradingbot/userDataStream", true);
			xhttpRequest.send();
		});
	return await myPromise;
}

getListenKey().then((listenKey) => 
{ 	
	var localListenKey = String(listenKey);
	var W3CWebSocketUserDataStream = require('websocket').w3cwebsocket;
	var socketUserDataStream = new W3CWebSocket("wss://stream.binance.com:9443/ws/"+listenKey);
	
	socketUserDataStream.onopen = function(event)
	{
		console.log('onopen');
	}
	
	socketUserDataStream.onmessage = function(event)
	{
		console.log('onmessage');
		var message = JSON.parse(event.data);
		console.log(JSON.stringify(message));
		var payload = Object(message.o);
		var executionType = String(payload.X);
		if(executionType==="expired"){console.log('deleteOrder');}
	}
	
	socketUserDataStream.onclose = function(event)
	{
		console.log('onclose');
	}
	
});

