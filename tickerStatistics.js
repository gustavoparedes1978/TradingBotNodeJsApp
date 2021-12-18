

//var exchangeInfoVar = {"stopPrice":stopPrice,"quantity":quantity,"closingPrice":closingPrice,"counterPrecision":counterPrecision};
var tickerStatistics = async function(symbol,info)
{	
	const myPromise = new Promise(function(resolve, reject) 
		{
			var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
			var xhttpRequest = new XMLHttpRequest();
	
			var jsonResponse = {};
			var exchangeInfoVar = {};
			exchangeInfoVar.stopPrice = info.openPrice;
			exchangeInfoVar.closingPrice = info.closePrice;
			exchangeInfoVar.quantity = 
			
			
			xhttpRequest.onreadystatechange = function() 
			{
				if (this.readyState === 4 && this.status === 200) 
					{
						jsonResponse = JSON.parse(this.responseText);
						console.log(jsonResponse);
						var tickSize = jsonResponse.symbols[0].filters[0].tickSize;
						var divider = 1;
						var division = tickSize/divider;
						var counterPrecision = 0;
						while(division!==1)
						{
							divider = divider/10;
							division = tickSize/divider;
							counterPrecision++;
						}	 
						exchangeInfoVar.counterPrecision = counterPrecision;
						var stepSize = jsonResponse.symbols[0].filters[2].stepSize;
						var divider = 1;
						var division = stepSize/divider;
						var counterPrecision = 0;
						while(division!==1)
						{
							divider = divider/10;
							division = stepSize/divider;
							counterPrecision++;
						}
						var quantity = info.balance/info.openPrice;
						quantity = quantity.toFixed(counterPrecision);
						exchangeInfoVar.quantity = quantity;
					}											
			}
			
			xhttpRequest.onerror = function()
			{
				console.log('tickerStatistics error');
			}
				
			xhttpRequest.open("GET", "https://api.binance.com/api/v3/exchangeInfo?symbol="+symbol, true);
			xhttpRequest.send();
		});
}

var symbol = "BTCUSDT";
var info = {"symbol":"BTCUSDT","openPrice":50000,"closePrice":60000,"breakPoint":55000,"ATR":150,"percentage":0.25,"balance":25,"orderType":"buyOrder"};
tickerStatistics(symbol,info);