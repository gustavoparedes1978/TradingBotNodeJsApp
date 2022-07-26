var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhttpRequest = new XMLHttpRequest();
var exchangeInfoVar = {};

xhttpRequest.onreadystatechange = function() 
{
	if (this.readyState === 4 && this.status === 200) 
		{
			var jsonResponse = JSON.parse(this.responseText);
			var symbols = jsonResponse.symbols;
			//console.log(symbols);
			var tickSize = 0;
			var stepSize = 0;
			var symbol = "BTCUSDT";
			symbols.forEach(function(item,index){
				console.log(item.symbol);
				var currentSymbol = String(item.symbol);
				if(currentSymbol===item.symbol)
				{
					tickSize = Number(item.filters[0].tickSize);
					stepSize = Number(item.filters[2].stepSize);
				}
			});
			console.log(tickSize+' '+stepSize);

			console.log('tickSize '+tickSize);
			var counterPrecision = 0;
			while(tickSize!==1)
			{
				tickSize = tickSize*10;
				counterPrecision++;
			}	
			
			var stepSize = Number(jsonResponse.symbols[0].filters[2].stepSize);
			console.log('stepSize '+stepSize);
			var counterPrecision = 0;
			while(stepSize!==1)
			{
				stepSize = stepSize*10;
				counterPrecision++;
			}	
			
			var response = {'booleanExchangeInfo':true,'exchangeInfoVar':exchangeInfoVar};
		}											
};

xhttpRequest.onerror = function(error)
{
	console.log('exchangeInfo error '+symbol);
	var response = {'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar}
};

xhttpRequest.open("GET", "https://fapi.binance.com/fapi/v1/exchangeInfo?symbol=BTCUSDT", true);
xhttpRequest.send();
