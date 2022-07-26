/*

[
  [
    1499040000000,      // Open time
    "0.01634790",       // Open
    "0.80000000",       // High
    "0.01575800",       // Low
    "0.01577100",       // Close
    "148976.11427815",  // Volume
    1499644799999,      // Close time
    "2434.19055334",    // Quote asset volume
    308,                // Number of trades
    "1756.87402397",    // Taker buy base asset volume
    "28.46694368",      // Taker buy quote asset volume
    "17928899.62484339" // Ignore.
  ]
]

*/



var lastKlineData = async function(symbol)
	{
		var jsonResponse = {};
		
		const myPromise = new Promise(function(resolve, reject) 
		{
			var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
			var xhttpRequest = new XMLHttpRequest();
			
			var jsonResponse = {};
										
			xhttpRequest.onreadystatechange = function() 
			{
				var status = this.status;
				var readyState = this.readyState;
				
				if (readyState === 4 && (status === 0 || (status >= 200 && status < 400))) 
				{
					console.log('lastKlineData true '+symbol+' '+this.responseText);
					var booleanResponse = true;
					try{
						JSON.parse(this.responseText);
					}
					catch (e)
					{
						booleanResponse = false;
						console.log('lastKlineData catcherror');
						console.log(e+' symbol');
					}
					finally
					{
						if(booleanResponse){jsonResponse = JSON.parse(this.responseText);}
						var code = jsonResponse.code;
						if(typeof code === "undefined")
						{							
							console.log(jsonResponse[0][2]); //high
							console.log(jsonResponse[0][3]); //low
							jsonResponse = {"high":jsonResponse[0][2],"low":jsonResponse[0][3]};
							resolve(jsonResponse);
						}
						else
						{	
							resolve(jsonResponse);
						}
					}
				}
				
			};
				
			xhttpRequest.onerror = function(error)
			{
				console.log('orderingFunc onerror');
				resolve(jsonResponse);
			};

			var pathVar = '/tradingbot/klineCandlestickData?symbol='+symbol;
		
			xhttpRequest.ontimeout = function (e) 
			{
				var jsonResponse = {};
				resolve(jsonResponse);
			};
			
			xhttpRequest.open("GET","http://localhost:8091"+pathVar,true);
			xhttpRequest.timeout = 2000;
			xhttpRequest.send();
		});

		return await myPromise;
	}
	
lastKlineData('BTCUSDT');