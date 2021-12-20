class Bot
{	
		constructor(symbol, symbolStream, allowedToTrade) 
			{	
				var http = require("http");
				var url = require("url");
				var fs = require("fs");
				
				/*
				http.createServer(function (req, res) {
					var q = url.parse(req.url, true);
					var filename = q.pathname;
					var template = "";
					var mimeType = "";

					switch(filename) {
						case "/":
							template = "./public/index.html";
							mimeType = "text/html";
							break;
						case "/css/style.css":
							template = "./public/css/style.css";
							mimeType = "text/css";
							break;
						case "/js/kagi.js":
							template = "./public/js/kagi.js";
							mimeType = "application/javascript";
							break;
						case "/js/data.js":
							template = "./public/js/data.js";
							mimeType = "application/javascript";
							break;
						case "/js/main.js":
							template = "./public/js/main.js";
							mimeType = "application/javascript";
							break;
						case "/js/HistoricalData.js":
							template = "./public/js/HistoricalData.js";
							mimeType = "application/javascript";
							break;
						case "/js/WebSocket.js":
							template = "./public/js/WebSocket.js";
							mimeType = "application/javascript";
							break;
					}

					fs.readFile(template, function(err, data) 
					{
						if (err) {
							res.writeHead(404, {'Content-Type': 'text/html'});
							return res.end("404 Not Found");
						}
						else
						{
							res.writeHead(200, {'Content-Type': mimeType});
							res.write(data);
							return res.end();
						}
					});

				}).listen(port);

				*/
				var stream = "@kline_30m";
				var streamName = [symbolStream+stream];
				var W3CWebSocket = require('websocket').w3cwebsocket;
				var socket = new W3CWebSocket("wss://stream.binance.com:9443/ws/"+streamName);
				setInterval(function()
					{
						var jsonMessage = {"method":"SUBSCRIBE","params":streamName,"id":1};
						var message = JSON.stringify(jsonMessage);
						if(socket.readyState===1){socket.send(message);}	
					}, 3600000);
				var lowestATR = 0;
				var lastBreakPoint = 0;
				var currentCloseTime = 0;
				var readyForTrading = false;
				var buyingAttempts = 0;
				var sellingAttempts = 0;
				var divider = 256;
				var lastClosingPrice = 0;
			
				var globalValue = {};
				var balance = 25;
				var buyOrders = [];
				var sellOrders = [];
												
				var loadDataWebSocket = async function(symbol,lowestATR,lastBreakPoint)
					{		

						const myPromise = new Promise(function(resolve, reject) 
						{
							var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
							var xhttpRequest = new XMLHttpRequest();

							xhttpRequest.onerror = function(error)
								{
									console.log("loadDataWebSocket error "+error+" "+symbol);
									resolve({"lowestATR":lowestATR,"lastBreakPoint":lastBreakPoint});
								};
							
							xhttpRequest.onreadystatechange = function() 
								{
							
									if (this.readyState === 4 && this.status === 200) 
									{
										var array = JSON.parse(this.responseText);
										var x;
										var limit;
										var sum;
										var divider = 0;

										var ATR_SMAs_Array = [];

										//SMA simple moving average
										for(limit = array.length-3; limit > 0; limit--)
										{
											sum = 0;
											divider++;
											for(x = array.length-2; x > limit; x--)
											{
												var highMinusLow = array[x][2]-array[x][3];
												var highMinusClosePrev = Math.abs(array[x][2]-array[x-1][4]);
												var lowMinusClosePrev = Math.abs(array[x][3]-array[x-1][4]);
												var currentATR = Math.max(Math.max(highMinusLow,highMinusClosePrev),lowMinusClosePrev);
												sum += currentATR;
											}
											var sumSMA = sum/divider;
											/*var option = document.createElement("option");
											option.text = "ATR SMA "+sumSMA+" ";
											option.value = sumSMA;
											reversalValueId.add(option);*/

											ATR_SMAs_Array.push(sumSMA);
										}

										ATR_SMAs_Array.sort(function(a, b){return a - b});
										var lowestATRLocal = ATR_SMAs_Array[0];
										var date = new Date();

										var data = [];
										for(x = 0; x<array.length-1;x++)
										{
											var close  = parseFloat(array[x][4]);
											var date = new Date(array[x][6]);
											var month = parseInt(date.getMonth());
											month+=1;
											var formattedDate = date.getFullYear()+"-"+date.getDate()+"-"+month;
											var object = {'close':close,'date':formattedDate};
											data.push(object);
										}
											
										var preprocess_data_result = preprocess_data(data, "diff", ATR_SMAs_Array[0]);
										var lastObject = preprocess_data_result.length-1;
										var lastBreakPointLocal = preprocess_data_result[lastObject].close;
										
										//drawChart(data,ATR_SMAs_Array[0]);

										//RMA exponential moving average with alpha = 1/length
										/*
										var sum = 0;
										var exp = 0;
										var divisor;
										for(divisor=1;divisor<=999;divisor++)
										{
											for(x = array.length-2; x > 0; x--)
											{
												var highMinusLow = array[x][2]-array[x][3];
												var highMinusClosePrev = Math.abs(array[x][2]-array[x-1][4]);
												var lowMinusClosePrev = Math.abs(array[x][3]-array[x-1][4]);
												currentPrice = Math.max(Math.max(highMinusLow,highMinusClosePrev),lowMinusClosePrev);
												var alpha = 1/divisor;
												sum += alpha*(Math.pow(1-alpha,exp))*currentPrice;
												exp++;
											}
											//console.log('sum RMA '+alpha+' '+sum);
											sum = 0;
											exp = 0;
										}

										//EMA exponential moving average with alpha = 2/(length+1)
										var sum = 0;
										var exp = 0;
										var divisor;
										for(divisor=1;divisor<=999;divisor++)
										{
											for(x = array.length-2; x > 0; x--)
											{
												var highMinusLow = array[x][2]-array[x][3];
												var highMinusClosePrev = Math.abs(array[x][2]-array[x-1][4]);
												var lowMinusClosePrev = Math.abs(array[x][3]-array[x-1][4]);
												currentPrice = Math.max(Math.max(highMinusLow,highMinusClosePrev),lowMinusClosePrev);
												var alpha = 2/(divisor+1);
												sum += alpha*(Math.pow(1-alpha,exp))*currentPrice;
												exp++;
											}
											//console.log('sum EMA '+alpha+' '+sum);
											sum = 0;
											exp = 0;
										}

										//WMA weighted moving average
										var limit = 0;
										for(limit = 997; limit > 1; limit--)
										{
											var sum = 0;
											var i = 0;
											var denominator = 0;
											for(x = array.length-2; x > limit; x--)
												{
													var highMinusLow = array[x][2]-array[x][3];
													var highMinusClosePrev = Math.abs(array[x][2]-array[x-1][4]);
													var lowMinusClosePrev = Math.abs(array[x][3]-array[x-1][4]);
													currentPrice = Math.max(Math.max(highMinusLow,highMinusClosePrev),lowMinusClosePrev);
													var alpha = ((array.length-2) - limit) - i;
													sum += alpha*currentPrice;
													console.log(alpha);
													denominator += alpha;
													i++;
												}
											console.log('sum WMA '+denominator+' '+sum/denominator);

										}*/
										resolve({"lowestATR":lowestATRLocal,"lastBreakPoint":lastBreakPointLocal});
									}
									
								};
							xhttpRequest.open("GET", "https://api.binance.com/api/v3/klines?symbol="+symbol+"&interval=30m&limit=1000", true);
							xhttpRequest.send();
						});
						return await myPromise;
					}
					
				var SQL = async function(symbol,info,table,column,operation,allowedToTrade)
					{
						const mysqlx = require('@mysql/xdevapi');
						const config = { host:'10.79.160.2',schema: 'BOT', table, user: 'root', passwd:'GaPo2030$$$1978', 
										 pooling: { enabled: true, maxIdleTime: 30000, maxSize: 25, queueTimeout: 10000 } };
						var client = mysqlx.getClient(config);
						const myPromise = new Promise(function(resolve, reject) 
						{
							client.getSession().then(session =>
							{
								const table = session.getSchema(config.schema).getTable(table);
								if(operation==="insert")
								{
									table.insert('symbol', column)
										.values(symbol,info)
										.execute()
										.then(() => {
											resolve(true);
										})
										.then(() => {
											return session.close();
										})
										.catch (function (err) {
											console.log('Insert error: ' + err.message + ' '+symbol);
											resolve(false);
										});
								}
								if(operation==="update")
								{
									table.update()
										.where('symbol = :symbol')
										.bind('symbol',symbol)
										.set(column,info)
										.execute()
										.then(() => {
											resolve(true);
										})
										.then(() => {
											return session.close();
										})
										.catch (function (err) {
											console.log('Update error: ' + err.message + ' '+symbol);
											resolve(false);
										});
								}
								if(operation==="delete")
								{
									table.delete()
										.where('symbol = :symbol')
										.bind('symbol',symbol)
										.execute()
										.then(() => {
											resolve(true);
										})
										.then(() => {
											return session.close();
										})
										.catch (function (err) {
											console.log('Delete error: ' + err.message + ' '+symbol);
											resolve(false);
										});	
								}
								if(operation==="select")
								{
									table.select(column)
										.where('symbol = :symbol')
										.bind('symbol',symbol)
										.execute()
										.then((res) => {
											info = res.fetchAll();
											resolve(info);
										})
										.then(() => {
											return session.close();
										})
										.catch (function (err) {
											console.log('Select error: ' + err.message + ' ' +symbol);
											resolve(info);
										});
								}
								if(operation==="reset")
								{
									table.update()
										.where('true')
										.set('allowedToTrade',false)
										.execute()
										.then(() => {
											resolve(true);
										})
										.then(() => {
											return session.close();
										})
										.catch (function (err) {
											console.log('Reset error: ' + err.message + ' '+symbol);
											resolve(false);
										});
								}
								if(operation==="switch")
								{
									table.update()
										.where('symbol = :symbol')
										.bind('symbol',symbol)
										.set('allowedToTrade',allowedToTrade)
										.execute()
										.then(() => {
											resolve(true);
										})
										.then(() => {
											return session.close();
										})
										.catch (function (err) {
											console.log('Switch error: ' + err.message + ' '+symbol);
											resolve(false);
										});
								}
							
							}).catch (function (err) {
								console.log('Database error: ' + err.message + ' '+symbol);
							});
						});
						return await myPromise;
					}
					
				var managingOrdersBinance = async function(symbol,info,command)
					{
						
						var exchangeInfoFunc = async function(symbol,info)
						{
							const myPromise = new Promise(function(resolve, reject) 
							{
								var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
								var xhttpRequest = new XMLHttpRequest();
								var exchangeInfoVar = {};
								
								xhttpRequest.onreadystatechange = function() 
								{
									if (this.readyState === 4 && this.status === 200) 
										{
											var jsonResponse = JSON.parse(this.responseText); 
											var openPrice = Number(info.openPrice);
											var closePrice = Number(info.closePrice);
											var orderType = String(info.orderType);
											var breakPoint = Number(info.breakPoint);
											var tickSize = Number(jsonResponse.symbols[0].filters[0].tickSize);
											var counterPrecision = 0;
											while(tickSize!==1)
											{
												tickSize = tickSize*10;
												counterPrecision++;
											}	
											openPrice = openPrice.toFixed(counterPrecision);
											closePrice = closePrice.toFixed(counterPrecision);
											
											exchangeInfoVar.openPrice = Number(openPrice);
											exchangeInfoVar.closePrice = Number(closePrice);
											exchangeInfoVar.breakPoint = Number(breakPoint);
											exchangeInfoVar.orderType = String(orderType);
											exchangeInfoVar.counterPrecision = Number(counterPrecision);
											
											var stepSize = Number(jsonResponse.symbols[0].filters[2].stepSize);
											var counterPrecision = 0;
											while(stepSize!==1)
											{
												stepSize = stepSize*10;
												counterPrecision++;
											}	
											var quantity = Number(info.balance)/Number(info.openPrice);
											quantity = quantity.toFixed(counterPrecision);
											exchangeInfoVar.quantity = Number(quantity);
											
											var response = {'booleanExchangeInfo':true,'exchangeInfoVar':exchangeInfoVar};
											resolve(response);
										}											
								};
		
								xhttpRequest.onerror = function(error)
								{
									console.log('exchangeInfo error '+symbol);
									var response = {'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar}
									resolve(response);
								};
								
								xhttpRequest.open("GET", "https://api.binance.com/api/v3/exchangeInfo?symbol="+symbol, true);
								xhttpRequest.send();
								
							});
							return await myPromise;
						}
						
						var limitOneFunc = async function(res)
						{
							var booleanExchangeInfo = Boolean(res.booleanExchangeInfo);
							var exchangeInfoVar = Object(res.exchangeInfoVar);
							var localOrderType = String(exchangeInfoVar.orderType);
							var booleanLimitOne = false;
							
							var localSide1 = ""; var localSide2 = ""; 
							if(localOrderType==="buyOrder")
							{
								localSide1="BUY";
								localSide2="SELL";
							}
							
							if(localOrderType==="sellOrder")
							{
								localSide1="SELL";
								localSide2="BUY";
							}
							
							exchangeInfoVar.localSide2 = localSide2;
							
							const myPromise = new Promise(function(resolve, reject) 
							{
								if(booleanExchangeInfo)
								{
									var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
									var xhttpRequest = new XMLHttpRequest();
										
									xhttpRequest.onreadystatechange = function() 
									{
										if (this.readyState === 4 && this.status === 200) 
										{
											console.log('limitOneFunc '+this.responseText);
											var jsonResponse = JSON.parse(this.responseText); 
											if(Object.keys(jsonResponse).length!==0)
											{
												console.log(jsonResponse.code+' '+jsonResponse.msg);
												booleanLimitOne = false;
												var response = {'booleanLimitOne':booleanLimitOne,'exchangeInfoVar':exchangeInfoVar}
												resolve(response);
											}
											else
											{
												booleanLimitOne = true;
												var response = {'booleanLimitOne':booleanLimitOne,'exchangeInfoVar':exchangeInfoVar}
												resolve(response);
											}
										}											
									};
										
									xhttpRequest.onerror = function(error)
									{
										console.log('LIMIT1 error '+symbol);
										var response = {'booleanLimitOne':booleanLimitOne,'exchangeInfoVar':exchangeInfoVar};
										resolve(response);
									};
									
									var counterPrecision = Number(exchangeInfoVar.counterPrecision);
									
									var localPrice = Number(exchangeInfoVar.openPrice); //localPrice
									localPrice = localPrice.toFixed(counterPrecision);
									var localQuantity = exchangeInfoVar.quantity;
									
									var pathVar = '/tradingbot/testNewOrder?symbol='+symbol+'&side='+localSide1+'&type=LIMIT&timeInForce=GTC&quantity='+localQuantity+'&price='+localPrice;
									
									xhttpRequest.open("GET","http://localhost:8090"+pathVar);
									xhttpRequest.send();
								}
								else
								{
									console.log('LIMIT1 negated');
									var response = {'booleanLimitOne':booleanLimitOne,'exchangeInfoVar':exchangeInfoVar};
									resolve(response);
								}
								
							});
							return await myPromise;
						}
						
						var limitTwoFunc = async function(res)
						{
							var booleanLimitOne = Boolean(res.booleanLimitOne);
							var exchangeInfoVar = Object(res.exchangeInfoVar);
							var booleanLimitTwo = false;
							
							const myPromise = new Promise(function(resolve, reject) 
							{
								if(booleanLimitOne)
								{
									var localQuantity = Number(exchangeInfoVar.quantity);
									var localClosePrice = Number(exchangeInfoVar.closePrice);
									var localSide2 = String(exchangeInfoVar.localSide2);
							
									var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
									var xhttpRequest = new XMLHttpRequest();
									
									xhttpRequest.onreadystatechange = function() 
									{
										if (this.readyState === 4 && this.status === 200) 
										{
											console.log('limitTwoFunc '+this.responseText);
											var jsonResponse = JSON.parse(this.responseText); 
											if(Object.keys(jsonResponse).length!==0)
											{
												console.log(jsonResponse.code+' '+jsonResponse.msg);
												booleanLimitTwo = false;
												var response = {'booleanLimitOne':booleanLimitOne,'exchangeInfoVar':exchangeInfoVar}
												resolve(response);
											}
											else
											{
												booleanLimitTwo = true;
												var response = {'booleanLimitOne':booleanLimitOne,'exchangeInfoVar':exchangeInfoVar}
												resolve(response);
											}
										}											
									};
									
									xhttpRequest.onerror = function(error)
									{
										console.log('LIMIT2 error '+error+' '+symbol);
										var response = {'booleanLimitTwo':booleanLimitTwo,'exchangeInfoVar':exchangeInfoVar}
										resolve(response);
									};
									
									var pathVar = '/tradingbot/testNewOrder?symbol='+symbol+'&side='+localSide2+'&type=LIMIT&timeInForce=GTC&quantity='+localQuantity+'&price='+localClosePrice;
									
									xhttpRequest.open("GET","http://localhost:8090"+pathVar);
									xhttpRequest.send();
								}
								else
								{	
									var response = {'booleanLimitTwo':booleanLimitTwo,'exchangeInfoVar':exchangeInfoVar}
									resolve(response);
								}
							});
							return await myPromise;
						}

						var stopLossFunc = async function(res) 
						{
							var booleanLimitTwo = Boolean(res.booleanLimitTwo);
							var exchangeInfoVar = Object(res.exchangeInfoVar);
							var localOpenPrice = Number(exchangeInfoVar.openPrice);
							var counterPrecision = Number(exchangeInfoVar.counterPrecision);
							var localQuantity = Number(exchangeInfoVar.quantity);
							var localBreakPoint = Number(exchangeInfoVar.breakPoint);
							var localOrderType = String(exchangeInfoVar.orderType);
							
							const myPromise = new Promise(function(resolve, reject) 
							{
								if(booleanLimitTwo)
									{
										var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
										var xhttpRequest = new XMLHttpRequest();
										
										var price = 0; var localStopSide = "";
										if(localOrderType==="buyOrder"){localStopSide="SELL";}
										if(localOrderType==="sellOrder"){localStopSide="BUY";}
											
										price = 2*localBreakPoint-localOpenPrice;
										price = price.toFixed(counterPrecision);
										price = Number(price);
						
										xhttpRequest.onreadystatechange = function() 
											{
												if (this.readyState === 4 && this.status === 200) 
												{
													console.log('stopLossFunc '+this.responseText);
													var jsonResponse = JSON.parse(this.responseText); 
													if(Object.keys(jsonResponse).length!==0)
													{
														console.log(jsonResponse.code+' '+jsonResponse.msg);
														resolve(false);
													}
													else
													{
														resolve(true);
													}
												}											
											};
							
										xhttpRequest.onerror = function(error)
											{
												console.log('STOPLOSSLIMIT error '+symbol);
												resolve(false);
											};
											
										var pathVar='/tradingbot/testNewOrder?symbol='+symbol+'&side='+localStopSide+'&type=LIMIT&timeInForce=GTC&quantity='+localQuantity+'&price='+price;
						
										xhttpRequest.open("GET","http://localhost:8090"+pathVar);
										xhttpRequest.send();
									}
								else
									{
										resolve(false);
									}										
							});
							return await myPromise;
						}
						
						var cancelOpenOrdersFunc = async function(res)
						{
							var booleanStopLossLimit = Boolean(res);
							
							const myPromise = new Promise(function(resolve, reject) 
							{
								if(!booleanStopLossLimit)
								{
									
									var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
									var xhttpRequest = new XMLHttpRequest();
								
									xhttpRequest.onreadystatechange = function() 
										{
											if (this.readyState === 4 && this.status === 200) 
											{
												console.log('CANCELALLOPENORDERS success '+symbol);
												resolve(false);
											}											
										};
							
									xhttpRequest.onerror = function(error)
										{
											console.log('CANCELALLOPENORDERS error');
											resolve(false);
										};
							
									xhttpRequest.open("GET","http://localhost:8090/tradingbot/cancelAllOpenOrders?symbol="+symbol);
									xhttpRequest.send();
								}
								else
								{
									resolve(true);
								}
							});
							return await myPromise;
						}
						
						const myPromise = new Promise(function(resolve, reject) 
						{
							SQL(symbol,0,'balances','balance','switch',false)
							.then(() => { 		
								
								if(command==="insertOrder")
								{
									exchangeInfoFunc(symbol,info).then((res) =>  { var res2 = limitOneFunc(res); return Promise.resolve(res2); })
									.then((res2) => { var res3 = limitTwoFunc(res2); return Promise.resolve(res3); })
									.then((res3) => { var res4 = stopLossFunc(res3); return Promise.resolve(res4); })
									.then((res4) => { var res5 = cancelOpenOrdersFunc(res4); return Promise.resolve(res5); })
									.then((res5) => 
									{ 	
										var successful = Boolean(res5); 
										if(!successful)
										{
											SQL(symbol,0,'balances','balance','switch',true)
											.then(() => { resolve(res5); });											
										}
										else
										{
											resolve(res5);
										}
									});
								}
								if(command==="deleteOrder")
								{
									var res5 = cancelOpenOrdersFunc(true);
									SQL(symbol,0,'balances','balance','switch',true)
									.then(() => { resolve(true); });									
								}
								
							});
							
						});
						return await myPromise;
						
					}
						
						
					var preprocess_data = function(data, reversalType, reversalValue)
					{

						var trends = new Array();

						// Initialize the output data
						var output_data = [];

						var counter = 0;
						var trend;
						var j = 0;

						// Pushing the first data point as first day's close
						output_data.push({x:0,close:data[0].close,date:data[0].date});

						var broke_at = 0;

						// Make a copy of the data set to work upon.
						var temp_array = data.slice();

						// Figure out the "initial trend" in data to figure out the direction, thickness, color of line etc
						for(var k=1;k<temp_array.length;k++){
							var diff = temp_array[k].close - temp_array[k-1].close;
							if (diff>0){
								trend = '+';
								broke_at = k;
								break;
							}else if(diff<0){
								trend = '-';
								broke_at = k;
								break;
							}else{
								continue;
							}
						}

						// The first trend is initialized in the trends array based on the above iteration.
						trends[0] = trend;

						// We will slice the dataset from the value of the first change in trend above.
						var data = data.slice(broke_at-1);

						// Initializing the last_close variable to that of the dataset's first datapoint.
						var last_close = data[0].close;

						// Now the magic!
						for(var i=1; i<data.length; i++){
						   var diff = data[i].close - last_close;

						   if (diff>0){
								trend = '+'; // It is positive
						   }else if(diff<0){
								trend = '-'; // It is negative
						   }else if(diff==0){
								trend = trends[i-i]; // Values seem equal. Continue the previous trend.
						   }

						   // Set current trend to that of calculated above.
						   trends[i] = trend;

						   var value_to_compare = 0;
						   if(reversalType==="diff"){
							   value_to_compare = diff; // If reversalType is difference then just have to compare the change in value
						   }else{
							   value_to_compare = diff/last_close * 100; // If reversalType is pct then compute the change in value and compare
						   }
						   
						   // If the absolute value of change (be it difference or percentage) is greater than the configured reversal_value
						   if (Math.abs(value_to_compare) >= reversalValue){
							   // means there is a change in trend. time to move along the x axis
							   if(trends[i] != trends[i-1]){
								   counter = counter+1;
								   // Push the last_close at the new x position so a |_| or |-| kind of graph.
								   output_data.push({x:counter,close:last_close,date:data[i].date});
								   // Push the new close at the new x position
								   output_data.push({x:counter,close:data[i].close,date:data[i].date});
							   }
							   // means there is no change in trend. time to move along the y axis (upward or downward)
							   else{
									if(trends[i]=='+' && data[i].close>data[i-1].close){
										output_data.push({x:counter,close:data[i].close,date:data[i].date});
									}
									else if(trends[i]=='-' && data[i].close < data[i-1].close){
										output_data.push({x:counter,close:data[i].close,date:data[i].date});
									}
								}
							   last_close = data[i].close;
							   j=0;
						   }else{
								if(trends[i]==trends[i-1]){
									// If the trend is the same and the last_close values are conforming to the trend, then
									// push to output_data in a way that it extends along the y axis on the same x axis point (counter).
									if(trends[i]=='+' && data[i].close>data[i-1].close){
										output_data.push({x:counter,close:data[i].close,date:data[i].date});
									}
									else if(trends[i]=='-' && data[i].close < data[i-1].close){
										output_data.push({x:counter,close:data[i].close,date:data[i].date});
									}
									// Safe to set the last_close here as it is an actual point added to output_data.
									last_close = data[i].close;
									// Reset the interim j variable to 0
									// Means the original dataset and output_data set are back in sync.
									j=0;
								}else{
									// this is to ignore minor variations in the stock values. We reset the last_close and current trend
									// every time this piece of code gets executed.
									// In Kagi charts, minor fluctuations are ignored while plotting.
									// The output_data set and the original dataset are out of sync till j != 0.
									last_close = data[i-1-j].close;
									trends[i] = trends[i-1-j];
									j+=1;
								}
							}
						}
						return output_data;
					}
					
					var closingPrice = 0;
					startWebSocket(socket,streamName,symbolStream,balance,buyOrders,sellOrders,symbol,lowestATR,lastBreakPoint,currentCloseTime,lastClosingPrice,buyingAttempts,sellingAttempts,divider,readyForTrading,loadDataWebSocket,preprocess_data,SQL,managingOrdersBinance,allowedToTrade,closingPrice);
			
					function startWebSocket(socket,streamName,symbolStream,balance,buyOrders,sellOrders,symbol,lowestATR,lastBreakPoint,currentCloseTime,lastClosingPrice,buyingAttempts,sellingAttempts,divider,readyForTrading,loadDataWebSocket,preprocess_data,SQL,managingOrdersBinance,allowedToTrade,closingPrice)
					{
						
						socket.onopen = function(event) 
						{
							var date = new Date();
							console.log('socket state onopen '+date+' symbol '+symbol);
							SQL(symbol,0,'balances','balance','select',false).then((res) => {
								if(Object.keys(res).length!==0)
								{
									balance = Number(res[0]);
									SQL(symbol,balance,'balances','balance','switch',allowedToTrade).then((res) => { 
											var responseSwitch = Boolean(res);
											if(!responseSwitch){console.log('failedToSwitchSymbol');}
											
											SQL(symbol,{},'orders','info','select',false).then((res) => 
												{
													if(res.length!==0)
														{
															var JSONObject = JSON.parse(res[0]);
															var localATR = Number(JSONObject.ATR);
															var localBalance = Number(JSONObject.balance);
															var localOpenPrice = Number(JSONObject.openPrice);
															var localOrderType = JSONObject.orderType;
															var localClosePrice = Number(JSONObject.closePrice);
															var localPercentage = Number(JSONObject.percentage);
															var localBreakPoint = Number(JSONObject.breakPoint);
															var localSymbol = JSONObject.symbol;
															var info = {"symbol":localSymbol,"openPrice":localOpenPrice,"closePrice":localPercentage,"breakPoint":localBreakPoint,"ATR":localATR,"percentage":localPercentage,"balance":localBalance,"orderType":localOrderType};
															if(JSONObject.orderType==="buyOrder"){buyOrders.push(info);}
															if(JSONObject.orderType==="sellOrder"){sellOrders.push(info);}
														}
												});
										});
								}
								else
								{
									SQL(symbol,balance,'balances','balance','insert',false).then((res) => {
										var responseSelect = Boolean(res);
										if(!responseSelect){console.log('insertBalanceFailed');}
										
										SQL(symbol,balance,'balances','balance','switch',true).then((res) => {
											var responseSelect = Boolean(res);
											if(!responseSelect){console.log('switchingFailed');}											
										
										});
									});
								}
							});
						};
						
						socket.onmessage = function(event) 
						{	
								var innerFunc = async function(candle,buyOrders,sellOrders,buyingAttempts,sellingAttempts,symbol,lowestATR,lastBreakPoint,divider,readyForTrading,SQL,managingOrdersBinance,closingPrice,balance)
								{
									const myPromise = new Promise(function(resolve, reject) 
										{
											if(Object.keys(candle).length!==0)
											{
												var low = parseFloat(candle.l); //calculating lowest of time period
												var high = parseFloat(candle.h); //calculating highest of time period
												var date = new Date();
												
												var prom = (high-low)/divider;
												var lowestATRhalf = lowestATR/divider;
														
												var allowedToTrade = false;
												SQL(symbol,{},'balances','allowedToTrade','select',false).then((res) => {
													allowedToTrade = Boolean(parseInt(res[0]));
													if(allowedToTrade)
													{
														if(prom>=lowestATRhalf&&sellingAttempts>buyingAttempts&&readyForTrading) 
														{		
															if(closingPrice<lastBreakPoint)
															{
																var testingBalance = 0;
																var sellOrderPlacement = 0;
																var percentage = 0.15;
																var localBreakPoint = lastBreakPoint - (4/5)*(lastBreakPoint-closingPrice);
																while(testingBalance<balance)
																{
																	sellOrderPlacement = closingPrice - lowestATR*percentage;
																	testingBalance = balance*((closingPrice/sellOrderPlacement) - 1 - 0.00075) + balance;
																	percentage+=0.3;
																}
																if(testingBalance>balance)
																{
																	var info = {"symbol":symbol,"openPrice":closingPrice,"closePrice":sellOrderPlacement,"breakPoint":localBreakPoint,"ATR":lowestATR,"percentage":percentage,"balance":balance,"orderType":"sellOrder"};
																	SQL(symbol,balance,'balances','balance','switch',false).then((res) => {
																		
																	});
																	managingOrdersBinance(symbol,info,"insertOrder").then((success) => {
																		var successfulOrder = Boolean(success);
																		if(successfulOrder)
																		{
																				SQL(symbol,info,'orders','info','insert',false);
																				sellOrders.push(info);
																				resolve(true);
																		}
																	sellingAttempts = 0; buyingAttempts = 0;
																	});
																}
															}
														}
										
														if(prom>=lowestATRhalf&&sellingAttempts<buyingAttempts&&readyForTrading)
														{
															if(closingPrice>lastBreakPoint)
															{
																var testingBalance = 0;
																var buyOrderPlacement = 0;
																var percentage = 0.15;
																var localBreakPoint = lastBreakPoint + (4/5)*(closingPrice - lastBreakPoint);
																while(testingBalance<balance)
																{
																	buyOrderPlacement = closingPrice + lowestATR*percentage;
																	testingBalance = balance*((buyOrderPlacement/closingPrice) - 1 - 0.00075) + balance;
																	percentage+=0.15;
																}
																if(testingBalance>balance)
																{
																	var info = {"symbol":symbol,"openPrice":closingPrice,"closePrice":buyOrderPlacement,"breakPoint":localBreakPoint,"ATR":lowestATR,"percentage":percentage,"balance":balance,"orderType":"buyOrder"};
																	managingOrdersBinance(symbol,info,"insertOrder").then((success) => {
																		var successfulOrder = Boolean(success);
																		if(successfulOrder)
																		{
																				SQL(symbol,info,'orders','info','insert',false);
																				buyOrders.push(info);
																				resolve(true);
																		}															
																	});
																	sellingAttempts = 0; buyingAttempts = 0;
																}
															}
														}
														
														if(buyOrders.length===0||sellOrders.length===0)
														{
															resolve(false);
														}
													}
													else
													{
														resolve(false);
													}
												});
											}
											else
											{
												resolve(false);
											}
										});
									return await myPromise;
								}
								
								var outerFunc = async function(candle,buyOrders,sellOrders,symbol,lowestATR,lastBreakPoint,divider,readyForTrading,SQL,managingOrdersBinance,closingPrice,balance)
								{
									const myPromise = new Promise(function(resolve, reject) 
									{
										buyOrders.forEach(function(item,index){
											var localOpenPrice = item.openPrice;
											var localClosePrice = item.closePrice;
											var currentBreakPoint = item.breakPoint;
											var currentATR = item.ATR;
											var currentPercentage = item.percentage;
											var lastBalance = item.balance;
											var currentSymbol = item.symbol;
											var numberAttempts = item.numberAttempts;
											if(closingPrice>=localClosePrice)
											{
												SQL(currentSymbol,item,'orders','info','delete',false);
												buyOrders.splice(index,1);
												lastBalance = lastBalance*((closingPrice/localOpenPrice) - 1 - 0.00075) + lastBalance;
												SQL(currentSymbol,lastBalance,'balances','balance','update',false);
												SQL(currentSymbol,balance,'balances','balance','switch',true);
												managingOrdersBinance(symbol,info,"deleteOrder");
												sellingAttempts = 0; buyingAttempts = 0;
												resolve({"balance":lastBalance});						
											}
											var resistance = 2*currentBreakPoint-localOpenPrice;
											if(closingPrice<resistance)
											{
												buyOrders.splice(index,1);
												balance = balance*((closingPrice/localOpenPrice) - 1 - 0.00075) + balance;
												SQL(currentSymbol,balance,'balances','balance','update',false);
												lastBalance = lastBalance + (lastBalance - balance);
												sellingAttempts = 0; buyingAttempts = 0;
												numberAttempts++;
												if(numberAttempts<=10)
												{
													var testingBalance = 0;
													var buyOrderPlacement = 0;
													var percentage = 0.15;
													while(testingBalance<lastBalance)
													{
														buyOrderPlacement = closingPrice + currentATR*percentage;
														testingBalance = lastBalance*((buyOrderPlacement/closingPrice) - 1 - 0.00075) + lastBalance;
														percentage+= 0.15;
													}
													var localBreakPoint = currentBreakPoint + (4/5)*(closingPrice-currentBreakPoint);
													if(testingBalance>lastBalance)
													{	
														var info = {"symbol":currentSymbol,"openPrice":closingPrice,"closePrice":sellOrderPlacement,"breakPoint":localBreakPoint,"ATR":currentATR,"percentage":percentage,"balance":lastBalance,"orderType":"sellOrder","numberAttempts":numberAttempts};
														managingOrdersBinance(symbol,info,"insertOrder").then((success) => {
																var successfulOrder = Boolean(success);
																if(successfulOrder)
																	{
																		SQL(currentSymbol,info,'orders','info','update',false);
																		buyOrders.push(info);
																		resolve({"balance":balance});
																	}															
																});
													}
													var testingBalance = 0;
													var sellOrderPlacement = 0;
													var percentage = 0.15;
													while(testingBalance<lastBalance)
													{
														sellOrderPlacement = closingPrice - currentATR*percentage;
														testingBalance = lastBalance*((closingPrice/sellOrderPlacement) - 1 - 0.00075) + lastBalance;
														percentage+=0.15;
													}
													var localBreakPoint = currentBreakPoint - (4/5)*(currentBreakPoint - closingPrice);
													var info = {"symbol":currentSymbol,"openPrice":closingPrice,"closePrice":sellOrderPlacement,"breakPoint":localBreakPoint,"ATR":currentATR,"percentage":percentage,"balance":lastBalance,"orderType":"sellOrder","numberAttempts":numberAttempts};
													managingOrdersBinance(symbol,info,"insertOrder").then((success) => {
														var successfulOrder = Boolean(success);
														if(successfulOrder)
														{
															SQL(currentSymbol,info,'orders','info','update',false);
															sellOrders.push(info);
															resolve({"balance":balance});
														}															
													});
												}
												else
												{
													SQL(currentSymbol,info,'orders','info','delete',false);
													SQL(currentSymbol,balance,'balances','balance','switch',true);
												}
											}
											balance = lastBalance;
										});
						
										sellOrders.forEach(function(item,index){ 
											var localOpenPrice = item.openPrice;
											var localClosePrice = item.closePrice;
											var currentBreakPoint = item.breakPoint;
											var currentATR = item.ATR;
											var currentPercentage = item.percentage;
											var lastBalance = item.balance;
											var currentSymbol = item.symbol;
											var numberAttempts = item.numberAttempts;
											if(closingPrice<=localClosePrice)
											{
												SQL(currentSymbol,item,'orders','info','delete',false);
												sellOrders.splice(index,1);
												lastBalance = lastBalance*((localOpenPrice/closingPrice) - 1 - 0.00075) + lastBalance;
												SQL(currentSymbol,lastBalance,'balances','balance','update',false);
												SQL(symbol,balance,'balances','balance','switch',true);
												managingOrdersBinance(symbol,info,"deleteOrder");
												sellingAttempts = 0; buyingAttempts = 0;
												resolve({"balance":lastBalance});
											}
											var resistance = 2*(currentBreakPoint)-localOpenPrice;
											if(closingPrice>resistance)
											{
												sellOrders.splice(index,1);
												balance = balance*((localOpenPrice/closingPrice) - 1 - 0.00075) + balance;
												SQL(currentSymbol,balance,'balances','balance','update',false);
												lastBalance = lastBalance + (lastBalance - balance);
												sellingAttempts = 0; buyingAttempts = 0;
												numberAttempts++;
												if(numberAttempts<=10)
												{
													var testingBalance = 0;
													var buyOrderPlacement = 0;
													var percentage = 0.15;
													while(testingBalance<lastBalance)
													{
														buyOrderPlacement = closingPrice + currentATR*percentage;
														testingBalance = lastBalance*((buyOrderPlacement/closingPrice) - 1 - 0.00075) + lastBalance;
														percentage+= 0.15;
													}
													var localBreakPoint = currentBreakPoint + (4/5)*(closingPrice-currentBreakPoint);
													if(testingBalance>lastBalance)
													{	
														var info = {"symbol":currentSymbol,"openPrice":closingPrice,"closePrice":sellOrderPlacement,"breakPoint":localBreakPoint,"ATR":currentATR,"percentage":percentage,"balance":lastBalance,"orderType":"sellOrder","numberAttempts":numberAttempts};
														managingOrdersBinance(symbol,info,"insertOrder").then((success) => {
																var successfulOrder = Boolean(success);
																if(successfulOrder)
																	{
																		SQL(currentSymbol,info,'orders','info','update',false);
																		buyOrders.push(info);
																		resolve({"balance":balance});
																	}															
																});
													}
												}
												else
												{
													SQL(currentSymbol,info,'orders','info','delete',false);
													SQL(currentSymbol,balance,'balances','balance','switch',true);
												}
											}
											balance = lastBalance;
										});
										
										if(buyOrders.length===0||sellOrders.length===0)
										{
											resolve({"balance":balance});
										}	
									});
									return await myPromise;
								}
								
								var message = JSON.parse(event.data);
								var currentDate = parseInt(new Date().getTime());
								var currentCandle = Object(message.k);
								var closingPrice = parseFloat(currentCandle.c);
								var candle = Object(message.k);
								
								if(closingPrice>lastClosingPrice){
									buyingAttempts++;lastClosingPrice=closingPrice;sellingAttempts--;
								}
						
								if(closingPrice<lastClosingPrice){
									sellingAttempts++;lastClosingPrice=closingPrice;buyingAttempts--;
								}
								 
								innerFunc(candle,buyOrders,sellOrders,buyingAttempts,sellingAttempts,symbol,lowestATR,lastBreakPoint,divider,readyForTrading,SQL,managingOrdersBinance,closingPrice,balance)
								.then(()=> {
									outerFunc(candle,buyOrders,sellOrders,symbol,lowestATR,lastBreakPoint,divider,readyForTrading,SQL,managingOrdersBinance,closingPrice,balance)
									.then((res)=> {
										
											balance = Number(res.balance);
											if(currentDate>currentCloseTime)
												{
													if(currentCloseTime!==0){readyForTrading = true;}
													loadDataWebSocket(symbol,lowestATR,lastBreakPoint)
													.then((globalValue)=>
													{
														lowestATR = globalValue.lowestATR; lastBreakPoint = globalValue.lastBreakPoint;
													})
													var candleData = Object(message.k);
													lastClosingPrice = parseFloat(candleData.c);
													currentCloseTime = parseFloat(candleData.T);
													sellingAttempts = 0; buyingAttempts = 0;
													if(buyOrders.length!==0||sellOrders.length!==0){readyForTrading = false;}
												}
										});
									});
						};
						
						socket.onclose = function(event) {
							var date = new Date();
							if (event.wasClean) {
								var date = new Date();
								console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason} `+date+' '+symbol);
							} else {
								date = new Date();
								console.log('[close] Connection died '+date+' '+symbol);
							}
						};
					
						socket.onerror = function(error) {
							var date = new Date();
							console.log(`[error] ${error.message} `+date);
						};
					}
								
			}

						/*
						* {"e":"kline","E":1616193759978,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238861,"o":"57641.00000000","c":"58402.74000000","h":"59468.00000000","l":"56270.74000000","v":"50460.12843600","n":1819603,"x":false,"q":"2940181959.97141612","V":"24618.24808700","Q":"1434862931.36678269","B":"0"}}
						*/			
}		

class Initializer
{
		
	constructor() 
		{
			var SQL = async function(symbol,info,table,column,operation,allowedToTrade)
				{
					const mysqlx = require('@mysql/xdevapi');
					const config = { host:'10.79.160.2',schema: 'BOT', user: 'root', passwd:'GaPo2030$$$1978', 
									pooling: { enabled: true, maxIdleTime: 30000, maxSize: 25, queueTimeout: 10000 } };
					var client = mysqlx.getClient(config);
					const myPromise = new Promise(function(resolve, reject) 
					{
						client.getSession().then(session =>
						{
							const table = session.getSchema(config.schema).getTable(table);
							if(operation==="insert")
							{
								table.insert('symbol', column)
									.values(symbol,info)
									.execute()
									.then(() => {
										return table.select(column)
										.execute()
									})
									.then(() => {
										resolve(true);
									})
									.then(() => {
										return session.close();
									})
									.catch (function (err) {
										console.log('Insert error: ' + err.message + ' '+symbol);
										resolve(false);
									});	
							}
							if(operation==="update")
							{
								table.update()
									.where('symbol = :symbol')
									.bind('symbol',symbol)
									.set(column,info)
									.execute()
									.then(() => {
										resolve(true);
									})
									.then(() => {
										return session.close();
									})
									.catch (function (err) {
										console.log('Update error: ' + err.message + ' '+symbol);
										resolve(false);
									});
							}
							if(operation==="delete")
							{
								table.delete()
									.where('symbol = :symbol')
									.bind('symbol',symbol)
									.execute()
									.then(() => {
										resolve(true);
									})
									.then(() => {
										return session.close();
									})
									.catch (function (err) {
										console.log('Delete error: ' + err.message+ ' '+symbol);
										resolve(false);
									});		
							}
							if(operation==="select")
							{
								table.select(column)
									.where('symbol = :symbol')
									.bind('symbol',symbol)
									.execute()
									.then((res) => {
										info = res.fetchAll();
										resolve(info);
									})
									.then(() => {
										return session.close();
									})
									.catch (function (err) {
										console.log('Select error: ' + err.message + ' '+symbol);
										resolve(info);
									});
							}
							if(operation==="reset")
							{
									table.update()
										.where('true')
										.set('allowedToTrade',false)
										.execute()
										.then(() => {
											resolve(true);
										})
										.then(() => {
											return session.close();
										})
										.catch (function (err) {
											console.log('Reset error: ' + err.message);
											resolve(false);
										});
							}
							if(operation==="switch")
							{
								table.update()
									.where('symbol = :symbol')
									.bind('symbol',symbol)
									.set('allowedToTrade',allowedToTrade)
									.execute()
									.then((res) => {
										resolve(true);
									})
									.then(() => {
										return session.close();
									})
									.catch (function (err) {
										console.log('Switch error: ' + err.message + ' '+symbol);
										resolve(false);
									});
							}
							if(operation==="pending")
							{
								table.select('symbol')
									.execute()
									.then((res) => {
										info = res.fetchAll();
										resolve(info);
									})
									.then(() => {
										return session.close();
									})
									.catch (function (err) {
										console.log('Pending error: ' + err.message);
										resolve(info);
									});
							}
						
						}).catch (function (err) {
							console.log('Database error: ' + err.message);
						});			
					});
					return await myPromise;
				}

			var tickerStatistics = async function()
				{	
					const myPromise = new Promise(function(resolve, reject) 
						{
							var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
							var xhttpRequest = new XMLHttpRequest();
							xhttpRequest.onerror = function()
								{
									console.log('tickerStatistics error '+symbol);
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
											if(symbol.indexOf('USDT')!==-1&&!symbol.startsWith('USDT')){
											filteredVolumes.push({"symbol":item.symbol,"volume":item.volume,"lastPrice":item.lastPrice});}
										});
										var sortedVolumes = [];
										sortedVolumes.push(filteredVolumes[0]);
										filteredVolumes.forEach(function(item,index){
											var localVolumeResponse = Number(item.volume)*Number(item.lastPrice);
											var index2;
											for(index2=0;index2<sortedVolumes.length;index2++)
												{	
													var localVolumeSorting = Number(sortedVolumes[index2].volume)*Number(sortedVolumes[index2].lastPrice);
													if(localVolumeResponse>localVolumeSorting){sortedVolumes.splice(index2,0,item);break;}
													if(localVolumeResponse===localVolumeSorting){break;}
													var index3 = sortedVolumes.length-1;
													if(index2===index3){sortedVolumes.push(item);break;}	
												}
										});
										var excludedSignals = ['BUSDUSDT','USDCUSDT','EURUSDT','GBPUSDT','TUSDUSDT','USDPUSDT','SUSDUSDT','BUSDTRY'];
										var index4;
										for(index4=0;index4<excludedSignals.length;index4++)
										{
											var index5;
											for(index5=0;index5<sortedVolumes.length;index5++)
												{
													var localSignal = sortedVolumes[index5].symbol;
													if(localSignal.indexOf(excludedSignals[index4])!==-1)
													{
														sortedVolumes.splice(index5,1);
													}
												}
										}
										sortedVolumes.splice(20,sortedVolumes.length-20);
										resolve(sortedVolumes);
									}																				
								};
							xhttpRequest.open("GET", "https://api.binance.com/api/v3/ticker/24hr", true);
							xhttpRequest.send();
						});
					return await myPromise;
				}
				
			function init(SQL,tickerStatistics)
				{
					tickerStatistics().then((sortedVolumes) => { 
						var sortedVolumesResult = sortedVolumes;
						if(Object.keys(sortedVolumes).length===0)
						{
							init(SQL,tickerStatistics);
						}
						else
						{
							SQL('',{},'orders','Symbol','pending',false).then((res) =>
								{
									var pendingOrders = res;
									pendingOrders.forEach(function(item,index)
									{
										var localSymbol = String(item);
										sortedVolumesResult.forEach(function(item2,index2) 
										{
											var localSymbolSorted = String(item2.symbol);
											if(localSymbolSorted===localSymbol){pendingOrders.splice(index,1);}
										});
									});
									pendingOrders.forEach(function(item,index)
									{
										var localSymbol = String(item);
										var localSymbolLW = String(localSymbol.toLowerCase());
										new Bot(localSymbol,localSymbolLW,false);
									});
									
								});
							SQL('',{},'balances','balance','reset',false).then((res) => 
								{
									var success = Boolean(res);
									if(success)
									{
										sortedVolumesResult.forEach(function(item,index) 
										{
											var localSymbol = String(item.symbol);
											var localSymbolLW = String(localSymbol.toLowerCase());
											new Bot(localSymbol,localSymbolLW,true);
										});
									}
									else
									{
										init(SQL,tickerStatistics);
									}	
								});	
						}
						
					});
				}
			
			init(SQL,tickerStatistics);
		}
}

new Initializer();
