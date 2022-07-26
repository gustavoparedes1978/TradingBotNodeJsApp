var tickerStatistics = async function()
				{	
					const myPromise = new Promise(function(resolve, reject) 
						{
							var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
							var xhttpRequest = new XMLHttpRequest();
							
							xhttpRequest.onerror = function()
								{
									console.log('tickerStatistics error');
									var jsonResponse = {};
									resolve(jsonResponse);
								};
								
							xhttpRequest.onreadystatechange = function() 
								{
									if (this.readyState === 4 && this.status === 200) 
									{
										var jsonResponse = JSON.parse(this.responseText);
										var filteredVolumes = [];
										jsonResponse.forEach(function (item,index) {
											var symbol = String(item.symbol);
											console.log(symbol);
											if(symbol.indexOf('USDT')!==-1&&!symbol.startsWith('USDT')){
											filteredVolumes.push({"symbol":item.symbol,"volume":item.volume,"lastPrice":item.lastPrice});}
										});
									}										
								};
							
							xhttpRequest.open("GET", "https://fapi.binance.com/fapi/v1/ticker/24hr", true);
							xhttpRequest.send();
						
						});
					return await myPromise;
				}

tickerStatistics();