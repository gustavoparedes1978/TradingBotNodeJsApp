class Bot
{
	
		constructor(symbol, symbolStream) 
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

				}).listen(8090);*/

				
				var lowestATR = 0;
				var currentCloseTime = 0;
				var balance = 24.98;
				var lastBalance = 25;
				var buyOrders = [];
				var sellOrders = [];
				var numberAttempts = 0;
				var readyForTrading = false;
				var symbol = symbol;
				var socket = {};
				var lastHigh = 0; var lastLow = 0;
				var interval = '1d';
				
				var loadDataWebSocket = async function(symbol,lowestATR)
					{		

						const myPromise = new Promise(function(resolve, reject) 
							{
								var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
								var xhttpRequest = new XMLHttpRequest();

								xhttpRequest.onerror = function(error)
									{
										console.log("loadDataWebSocket error "+error+" "+symbol);
										resolve({"lowestATR":lowestATR});
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

											/*
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
											*/
											
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
											resolve({"lowestATR":lowestATRLocal});
										}
										
									};
								xhttpRequest.open("GET", "https://fapi.binance.com/fapi/v1/klines?symbol="+symbol+"&interval="+interval+"&limit=1000", true);
								xhttpRequest.send();
							});
						return await myPromise;
					}
					
				var managingOrdersBinance = async function(symbol,info,command)
					{
						
						var exchangeInfoFunc = async function(info)
						{
							const myPromise = new Promise(function(resolve, reject) 
							{
								var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
								var xhttpRequest = new XMLHttpRequest();
								var exchangeInfoVar = {};
								var localSide2 = info.localSide2;
								var positionSide2 = info.positionSide2;
								
								if(typeof localSide2 === "undefined"){ localSide2 = "";}
								if(typeof positionSide2 === "undefined"){ positionSide2 = "";}	
								
								var jsonResponse = {};
								
								xhttpRequest.onreadystatechange = function() 
								{
									var status = this.status;
									var readyState = this.readyState;
								
									if (readyState === 4 && (status === 0 || (status >= 200 && status < 400))) 
										{
											jsonResponse = this.responseText;
											var validatorResponse = true;
											try{
												JSON.parse(this.responseText);
											}
											catch (e)
											{
												validatorResponse = false;
												console.log(e+' '+symbol);
												var response = {'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar};
												resolve(response);
											}
											finally
											{
												if(validatorResponse){jsonResponse = JSON.parse(this.responseText);}
												if(Object.keys(jsonResponse).length!==0)
													{
														var symbols = jsonResponse.symbols;
														if(typeof symbols !== "undefined")
														{
															var tickSize = 1;
															var stepSize = 1;
															var localSymbol = String(symbol);
															symbols.forEach(function(item,index){
																var currentSymbol = String(item.symbol);
																if(currentSymbol===localSymbol)
																{
																	tickSize = Number(item.filters[0].tickSize);
																	stepSize = Number(item.filters[2].stepSize);
																}
															});
															var openPrice = Number(info.openPrice);
															var closePrice = Number(info.closePrice);
															var breakPoint = Number(info.breakPoint);
															var orderType = String(info.orderType);
															
															var counterPrecision = 0;
															while(tickSize!==1)
															{
																tickSize = tickSize*10;
																counterPrecision++;
															}	
															
															openPrice = openPrice.toFixed(counterPrecision);
															closePrice = closePrice.toFixed(counterPrecision);
															breakPoint = breakPoint.toFixed(counterPrecision);
															exchangeInfoVar.counterPrecision = counterPrecision;
															
															var counterPrecisionQuantity = 0;
															while(stepSize!==1)
															{
																stepSize = stepSize*10;
																counterPrecisionQuantity++;
															}	
															
															var quantity = Number(info.balance)/Number(info.openPrice);
															quantity = quantity.toFixed(counterPrecisionQuantity);
															
															exchangeInfoVar.quantity = Number(quantity);
															exchangeInfoVar.openPrice = Number(openPrice);
															exchangeInfoVar.closePrice = Number(closePrice);
															exchangeInfoVar.breakPoint = Number(breakPoint);
															exchangeInfoVar.quantity = Number(quantity);														
															exchangeInfoVar.orderType = String(orderType);
															exchangeInfoVar.balance = Number(balance);
															exchangeInfoVar.localSide2 = String(localSide2);
															exchangeInfoVar.positionSide2 = String(positionSide2);
															exchangeInfoVar.counterPrecisionQuantity = Number(counterPrecisionQuantity);
															
															var response = {'booleanExchangeInfo':true,'exchangeInfoVar':exchangeInfoVar};
															resolve(response);
														}
														else
														{
															var response = {'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar};
															resolve(response);
														}
													}
												else
													{
														var response = {'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar};
														resolve(response);
													}
											}
										}											
								};
		
								xhttpRequest.onerror = function(error)
								{
									console.log('exchangeInfo onerror '+symbol);
									var response = {'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar};
									resolve(response);
								};
								
								xhttpRequest.ontimeout = function (e) 
								{
									console.log('exchangeInfoFunc ontimeout '+symbol);
									var response = {'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar};
									resolve(response);
								};
								
								xhttpRequest.open("GET", "https://fapi.binance.com/fapi/v1/exchangeInfo", true);
								xhttpRequest.timeout = 2000;
								xhttpRequest.send();
								
							});
							return await myPromise;
						}
						
						var symbolPriceTicker = async function(res)
						{
							const myPromise = new Promise(function(resolve, reject) 
							{
								var exchangeInfoVar = Object(res.exchangeInfoVar);
								var booleanExchangeInfo = Boolean(res.booleanExchangeInfo);

								var localOpenPrice = Number(exchangeInfoVar.openPrice);
								var localBreakPoint = Number(exchangeInfoVar.breakPoint);
								var localClosePrice = Number(exchangeInfoVar.closePrice);
								var localQuantity = Number(exchangeInfoVar.quantity);
								var localOrderType = String(exchangeInfoVar.orderType);
								var localBalance = Number(exchangeInfoVar.balance);
								var localCounterPrecision = Number(exchangeInfoVar.counterPrecision);
								var localCounterPrecisionQuantity = Number(exchangeInfoVar.counterPrecisionQuantity);
								
								var jsonResponse = {};
								
								if(booleanExchangeInfo)
								{
									var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
									var xhttpRequest = new XMLHttpRequest();
									
									xhttpRequest.onreadystatechange = function() 
									{
										var status = this.status;
										var readyState = this.readyState;
										
										if (readyState === 4 && (status === 0 || (status >= 200 && status < 400))) 
										{
											console.log('symbolPriceTicker true '+symbol+' '+this.responseText);
											var booleanResponse = true;
											try{
												JSON.parse(this.responseText);
											}
											catch (e)
											{
												booleanResponse = false;
												console.log('symbolPriceTicker catcherror');
												console.log(e+' symbol');
											}
											finally
											{
												if(booleanResponse){jsonResponse = JSON.parse(this.responseText);}
												var code = jsonResponse.code;
												if(typeof code === "undefined")
												{
													var currentPrice = Number(jsonResponse.price);
													var mainDiff = Math.abs(currentPrice - localOpenPrice);
													console.log('mainDiff '+mainDiff);
													
													console.log('before... '+symbol);
	
													console.log('currentPrice '+currentPrice);
													console.log('openPrice '+localOpenPrice);
													console.log('breakPoint '+localBreakPoint);
													console.log('closePrice '+localClosePrice);
													
													if(localOpenPrice<currentPrice)
													{
														localOpenPrice += mainDiff;
														localBreakPoint += mainDiff;
														localClosePrice += mainDiff;
													}
													else
													{
														localOpenPrice -= mainDiff;
														localBreakPoint -= mainDiff;
														localClosePrice -= mainDiff;
													}
													
													console.log('after... '+symbol);
													console.log('currentPrice '+currentPrice);
													console.log('openPrice '+localOpenPrice);
													console.log('breakPoint '+localBreakPoint);
													console.log('closePrice '+localClosePrice);
													
													
													localOpenPrice = localOpenPrice.toFixed(localCounterPrecision);
													localBreakPoint = localBreakPoint.toFixed(localCounterPrecision);
													localClosePrice = localClosePrice.toFixed(localCounterPrecision);
													
													localQuantity = localBalance/localOpenPrice;
													localQuantity = localQuantity.toFixed(localCounterPrecisionQuantity);
													
													var localExchangeInfoVar = {};
													localExchangeInfoVar.openPrice = Number(localOpenPrice);
													localExchangeInfoVar.closePrice = Number(localClosePrice);
													localExchangeInfoVar.breakPoint = Number(localBreakPoint);
													localExchangeInfoVar.quantity = Number(localQuantity);
													localExchangeInfoVar.orderType = String(localOrderType);
													
													resolve({'booleanExchangeInfo':true,'exchangeInfoVar':localExchangeInfoVar});
												}
												else
												{
													resolve({'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar});
												}
											}
										}
										
									};
										
									xhttpRequest.onerror = function(error)
									{
										console.log('symbolPriceTicker error '+symbol);
										resolve({'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar});
									};
									
									var pathVar = '/tradingbot/symbolPriceTicker?symbol='+symbol;
								
									xhttpRequest.ontimeout = function (e) {
										console.log('symbolPriceTicker ontimeout '+symbol);
										resolve({'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar});
									};
									
									xhttpRequest.open("GET","http://localhost:8091"+pathVar,true);
									xhttpRequest.timeout = 2000;
									xhttpRequest.send();
								}
								else
								{
									console.log('symbolPriceTicker negated');
									var response = {'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar};
									resolve(response);
								}
							});
							return await myPromise;
						}
						
						var orderingFunc = async function(res)
						{
							var booleanExchangeInfo = Boolean(res.booleanExchangeInfo);
							var exchangeInfoVar = Object(res.exchangeInfoVar);
							
							var localOpenPrice = Number(exchangeInfoVar.openPrice);
							var localClosePrice = Number(exchangeInfoVar.closePrice);
							var localBreakPoint = Number(exchangeInfoVar.breakPoint);
							var localQuantity = Number(exchangeInfoVar.quantity);
							var localOrderType = String(exchangeInfoVar.orderType);
							
							var localSide1 = ""; var positionSide1 = "";
							var localSide2 = ""; var positionSide2 = "";
							
							if(localOrderType==='buyOrder')
							{
								localSide1 = "BUY";
								positionSide1 = "LONG";
								
								localSide2 = "SELL";
								positionSide2 = "LONG";
							}

							if(localOrderType==='sellOrder')
							{
								localSide1 = "SELL";
								positionSide1 = "SHORT";
								
								localSide2 = "BUY";
								positionSide2 = "SHORT";
							}

							var jsonResponse = {};
							
							const myPromise = new Promise(function(resolve, reject) 
							{
								if(booleanExchangeInfo)
								{
									var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
									var xhttpRequest = new XMLHttpRequest();
																
									xhttpRequest.onreadystatechange = function() 
									{
										var status = this.status;
										var readyState = this.readyState;
										
										if (readyState === 4 && (status === 0 || (status >= 200 && status < 400))) 
										{
											console.log('orderingFunc true '+symbol+' '+this.responseText);
											var booleanResponse = true;
											try{
												JSON.parse(this.responseText);
											}
											catch (e)
											{
												booleanResponse = false;
												console.log('orderingFunc catcherror');
												console.log(e+' symbol');
											}
											finally
											{
												if(booleanResponse){jsonResponse = JSON.parse(this.responseText);}
												var code = jsonResponse.code;
												
												var localExchangeInfoVar = {};
													
												localExchangeInfoVar.openPrice = Number(localOpenPrice);
												localExchangeInfoVar.closePrice = Number(localClosePrice);
												localExchangeInfoVar.breakPoint = Number(localBreakPoint);
												localExchangeInfoVar.quantity = Number(localQuantity);
												localExchangeInfoVar.orderType = String(localOrderType);
												
												if(typeof code === "undefined")
												{
													var response = {};
													var jsonResponseStatus = String(jsonResponse.status);
													console.log(jsonResponseStatus);
															
													if(jsonResponseStatus==="EXPIRED")
													{
														resolve({'booleanExchangeInfo':false,'exchangeInfoVar':localExchangeInfoVar}); 
													}
													else
													{
														resolve({'booleanExchangeInfo':true,'exchangeInfoVar':localExchangeInfoVar});
													}	
												}
												else
												{	
													resolve({'booleanExchangeInfo':false,'exchangeInfoVar':localExchangeInfoVar});
												}
											}
										}
										
									};
										
									xhttpRequest.onerror = function(error)
									{
										console.log('orderingFunc onerror');
										var localExchangeInfoVar = {};
													
										localExchangeInfoVar.openPrice = Number(localOpenPrice);
										localExchangeInfoVar.closePrice = Number(localClosePrice);
										localExchangeInfoVar.breakPoint = Number(localBreakPoint);
										localExchangeInfoVar.quantity = Number(localQuantity);
										localExchangeInfoVar.orderType = String(localOrderType);
										
										resolve({'booleanExchangeInfo':false,'exchangeInfoVar':localExchangeInfoVar});
									};
									
									var counterPrecision = Number(exchangeInfoVar.counterPrecision);
									var localQuantity = Number(exchangeInfoVar.quantity);
									
									var pathVar = '/tradingbot/newMarketOrder?symbol='+symbol+'&side='+localSide1+'&positionSide='+positionSide1+'&type=MARKET&quantity='+localQuantity;
								
									xhttpRequest.ontimeout = function (e) 
									{
										console.log('orderingFunc ontimeout');
										var localExchangeInfoVar = {};
													
										localExchangeInfoVar.openPrice = Number(localOpenPrice);
										localExchangeInfoVar.closePrice = Number(localClosePrice);
										localExchangeInfoVar.breakPoint = Number(localBreakPoint);
										localExchangeInfoVar.quantity = Number(localQuantity);
										localExchangeInfoVar.orderType = String(localOrderType);
										
										resolve({'booleanExchangeInfo':false,'exchangeInfoVar':localExchangeInfoVar});
									};
									
									xhttpRequest.open("GET","http://localhost:8091"+pathVar,true);
									xhttpRequest.timeout = 2000;
									xhttpRequest.send();
								}
								else
								{
									console.log('orderingFunc negated');
									resolve({'booleanExchangeInfo':false,'exchangeInfoVar':exchangeInfoVar});
								}
							});

							return await myPromise;
						}
						
						var ordering2Func = async function(res)
						{
							var booleanExchangeInfo = Boolean(res.booleanExchangeInfo);
							var exchangeInfoVar = Object(res.exchangeInfoVar);
							
							var localOpenPrice = Number(exchangeInfoVar.openPrice);
							var localClosePrice = Number(exchangeInfoVar.closePrice);
							var localBreakPoint = Number(exchangeInfoVar.breakPoint);
							var localQuantity = Number(exchangeInfoVar.quantity);
							var localOrderType = String(exchangeInfoVar.orderType);
							var localSide2 = String(exchangeInfoVar.localSide2);
							var positionSide2 = String(exchangeInfoVar.positionSide2);
							
							var jsonResponse = {};
							
							const myPromise = new Promise(function(resolve, reject) 
							{
								if(booleanExchangeInfo)
								{
									var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
									var xhttpRequest = new XMLHttpRequest();
																	
									xhttpRequest.onreadystatechange = function() 
									{
										var status = this.status;
										var readyState = this.readyState;
										
										if (readyState === 4 && (status === 0 || (status >= 200 && status < 400))) 
										{
											console.log('ordering2Func true '+symbol+' '+this.responseText);
											var booleanResponse = true;
											try{
												JSON.parse(this.responseText);
											}
											catch (e)
											{
												booleanResponse = false;
												console.log('ordering2Func catcherror');
												console.log(e+' '+symbol);
											}
											finally
											{
												if(booleanResponse){jsonResponse = JSON.parse(this.responseText);}
												var code = jsonResponse.code;
												
												if(typeof code === "undefined")
												{
													resolve(true);
												}
												else
												{
													var codeNumber = Number(jsonResponse.code);
													if(codeNumber===-2022)
														{
															var response = true;
															resolve(response);
														}
													else
														{
															var response = false;
															resolve(response);
														}
												}
											}
										}
										
									};
										
									xhttpRequest.onerror = function(error)
									{
										console.log('ordering2Func onerror');
										var response = false;
										resolve(response);
									};
									
									var pathVar = '/tradingbot/newMarketOrder?symbol='+symbol+'&side='+localSide2+'&positionSide='+positionSide2+'&type=MARKET&quantity='+localQuantity;
									
									console.log(pathVar);
									
									xhttpRequest.ontimeout = function (e) 
									{
										console.log('ordering2Func ontimeout');
										var response = false;
										resolve(response);
										
									};
									
									xhttpRequest.open("GET","http://localhost:8091"+pathVar,true);
									xhttpRequest.timeout = 2000;
									xhttpRequest.send();
								}
								else
								{
									console.log('ordering2Func negated');
									resolve(false);
								}
							});
							return await myPromise;
						}
						
						const myPromise = new Promise(function(resolve, reject) 
						{	
								if(command==='insertOrder')
								{
									exchangeInfoFunc(info).then((res) => { var res1 = symbolPriceTicker(res); return Promise.resolve(res1); })
									.then((res2) => { var res3 = orderingFunc(res2); return Promise.resolve(res3); })
									.then((res3) => {
										
										var jsonResponse = Object(res3);
										var booleanExchangeInfo = Boolean(jsonResponse.booleanExchangeInfo);
										
										var localExchangeInfoVar = Object(jsonResponse.exchangeInfoVar);
										var openPrice = Number(localExchangeInfoVar.openPrice);
										var closePrice = Number(localExchangeInfoVar.closePrice);
										var breakPoint = Number(localExchangeInfoVar.breakPoint);
										var quantity = Number(localExchangeInfoVar.quantity);
										
										var jsonResponse = {"openPrice":openPrice,"closePrice":closePrice,"breakPoint":breakPoint,"quantity":quantity,"response":booleanExchangeInfo};
										resolve(jsonResponse);
									
									});
								}
								
								if(command==='deleteOrder')
								{
									var localOrderType = String(info.orderType);
									var localInfo = info;
									
									if(localOrderType==='buyOrder')
									{
										localInfo.localSide2 = 'SELL';
										localInfo.positionSide2 = 'LONG';
									}
									
									if(localOrderType==='sellOrder')
									{
										localInfo.localSide2 = 'BUY';
										localInfo.positionSide2 = 'SHORT';
									}
										
									exchangeInfoFunc(localInfo).then((res) => { var res1 = ordering2Func(res); return Promise.resolve(res1); })
									.then((res1)=> { var message = Boolean(res1); resolve({'message':message}); });
								}
						});
						return await myPromise;
					}
					
					var lastKlineData = async function(symbol,interval)
					{
						var jsonResponse = {"high":0,"low":0};
						
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
											var high = Number(jsonResponse[0][2]);
											var low = Number(jsonResponse[0][3]);
											jsonResponse = {"high":high,"low":low};
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
								console.log('lastKlineData onerror');
								resolve(jsonResponse);
							};

							var pathVar = '/tradingbot/klineCandlestickData?symbol='+symbol+'&interval='+interval;
						
							xhttpRequest.ontimeout = function (e) 
							{
								console.log('lastKlineData ontimeout');
								var jsonResponse = {};
								resolve(jsonResponse);
							};
							
							xhttpRequest.open("GET","http://localhost:8091"+pathVar,true);
							xhttpRequest.timeout = 2000;
							xhttpRequest.send();
						});

						return await myPromise;
					}
					
					var startWebSocket = function()
					{
						var stream = "@kline_"+interval;
						var streamName = [symbolStream+stream];
						var W3CWebSocket = require('websocket').w3cwebsocket;
						socket = new W3CWebSocket("wss://stream.binance.com:9443/ws/"+streamName);
						
						socket.onopen = function(event) 
						{
							var date = new Date();
							console.log('socket state onopen '+date+' '+symbol);
						};
						
						socket.onmessage = function(event) 
						{
							var date = new Date();
						
							var message = JSON.parse(event.data);
							var currentDate = Number(new Date().getTime());
							var currentCandle = Object(message.k);
							var closingPrice = Number(currentCandle.c);
							var candle = Object(message.k);
							
							if(Object.keys(candle).length!==0)
							{
								
								if(readyForTrading&&closingPrice<lastLow&&lastLow!==0&&lowestATR!==0) 
								{
									readyForTrading = false;
									var sellOrderDate = new Date();
									console.log('attempting to insert sell order '+symbol+' '+sellOrderDate);
									var winningBalance = balance;
									var sellOrderPlacement = 0;
									var percentage = 0.10;
									while(winningBalance<lastBalance)
										{
											percentage += 0.01;
											sellOrderPlacement = closingPrice - lowestATR*percentage;
											sellOrderPlacement = Number(sellOrderPlacement);
											winningBalance = (closingPrice - sellOrderPlacement)*(balance/closingPrice) - (winningBalance*0.0008) + balance;
										}
									var localBreakPoint = closingPrice + (3/4)*lowestATR*percentage;
									var info = {"symbol":symbol,"openPrice":closingPrice,"closePrice":sellOrderPlacement,"breakPoint":localBreakPoint,"balance":balance,"orderType":"sellOrder"};
									console.log(JSON.stringify(info));
									managingOrdersBinance(symbol,info,'insertOrder').then((res) => {
										var response = Object(res);
										var openPrice = response.openPrice;
										var closePrice = response.closePrice;
										var breakPoint = response.breakPoint;
										var quantity = response.quantity;
										var successfulOrder = Boolean(response.response);
										if(successfulOrder)
										{
											var info = {"symbol":symbol,"openPrice":openPrice,"closePrice":closePrice,"breakPoint":breakPoint,"quantity":quantity,"balance":balance,"orderType":"sellOrder"};
											console.log(JSON.stringify(info))
											sellOrders.push(info);
											var sellOrderDate = new Date();
											console.log('Successfully submitting the sell order '+symbol+' '+sellOrderDate);
											numberAttempts = 0;
										}
										else
										{
											var sellOrderDate = new Date();
											console.log('Failed submitting the sell order '+symbol+' '+sellOrderDate);
											readyForTrading = true;
										}
									});
									
								}
								
								if(readyForTrading&&closingPrice>lastHigh&&lastHigh!==0&&lowestATR!==0)
								{
									readyForTrading = false;
									var buyOrderDate = new Date();
									console.log('attempting to insert buy order '+symbol+' '+buyOrderDate);
									var winningBalance = balance;
									var buyOrderPlacement = 0;
									var percentage = 0.10;
									while(winningBalance<lastBalance)
										{
											percentage += 0.01;
											percentage = Number(percentage);
											buyOrderPlacement = closingPrice + lowestATR*percentage;
											buyOrderPlacement = Number(buyOrderPlacement);
											winningBalance = (buyOrderPlacement - closingPrice)*(balance/closingPrice) - (winningBalance*0.0008) + balance;
										}
									var localBreakPoint = closingPrice - (3/4)*lowestATR*percentage;
									var info = {"symbol":symbol,"openPrice":closingPrice,"closePrice":buyOrderPlacement,"breakPoint":localBreakPoint,"balance":balance,"orderType":"buyOrder"};
									managingOrdersBinance(symbol,info,'insertOrder').then((res) => {
										var response = Object(res);
										var openPrice = Number(response.openPrice);
										var closePrice = Number(response.closePrice);
										var breakPoint = Number(response.breakPoint);
										var quantity = Number(response.quantity);
										var successfulOrder = Boolean(response.response);
										if(successfulOrder)
											{
												var info = {"symbol":symbol,"openPrice":openPrice,"closePrice":closePrice,"breakPoint":breakPoint,"quantity":quantity,"balance":balance,"orderType":"buyOrder"};
												console.log(JSON.stringify(info));
												buyOrders.push(info);
												var buyOrderDate = new Date();
												console.log('Successfully submitting the buy order '+symbol+' '+buyOrderDate);
												numberAttempts = 0;
											}
											else
											{
												var buyOrderDate = new Date();
												console.log('Failed submitting the buy order '+symbol+' '+buyOrderDate);
												readyForTrading = true;
											}
									});
								}						
							}
							
							buyOrders.forEach(function(item,index)
							{
								var localSymbol = String(item.symbol);																	
								var localOpenPrice = Number(item.openPrice);
								var localClosePrice = Number(item.closePrice);
								var localBreakPoint = Number(item.breakPoint);
								var localQuantity = Number(item.quantity);
								var localOrderType = String(item.orderType);
								if(closingPrice>=localClosePrice&&numberAttempts===0)
									{
										lastBalance = (closingPrice - localOpenPrice)*(balance/localOpenPrice) + balance;
										lastBalance -= lastBalance*0.0008;
										console.log('LocalWinningBalance '+lastBalance+' '+localSymbol);
										balance = lastBalance-0.02;
										numberAttempts++;									
										var closingDate = new Date();										
										console.log('Attempting to close the buy order '+localSymbol+' '+closingDate+' '+closingPrice+' '+localClosePrice);
										managingOrdersBinance(localSymbol,item,'deleteOrder').then((res) => {
										var response = Boolean(res.message);
										if(response)
											{
												buyOrders.splice(index,1);
												var sellClosingDate = new Date();
												console.log('Successfully deleting the buy order '+localSymbol+' '+sellClosingDate);
												readyForTrading = false;
											}
											else
											{
												var buyClosingDate = new Date();
												console.log('Failed deleting the buy order '+localSymbol+' '+buyClosingDate);
												numberAttempts--;
											}
										});
									}
								if(closingPrice<=localBreakPoint&&numberAttempts===0)
									{
										var losingBalance = (closingPrice - localOpenPrice)*(balance/localOpenPrice) + balance;
										console.log('LocalLosingBalance '+losingBalance+' '+localSymbol);
										console.log('LastBalance '+lastBalance);
										balance = losingBalance;
										numberAttempts++;
										var closingDate = new Date();
										console.log('Attempting to close the buy order on breakpoint '+localSymbol);
										managingOrdersBinance(localSymbol,item,'deleteOrder').then((res) => {
											var response = Boolean(res.message);
											if(response)
												{
													buyOrders.splice(index,1);
													var buyClosingDate = new Date();
													console.log('Successfully deleting the buy order on breakpoint '+localSymbol+' '+buyClosingDate);
													readyForTrading = true;
												}
												else
												{
													var buyClosingDate = new Date();
													console.log('Failed deleting the buy order on breakpoint '+localSymbol+' '+buyClosingDate);
													numberAttempts--;
												}
										});
									}
							});																	

							sellOrders.forEach(function(item,index)												
							{ 
								var localSymbol = String(item.symbol);																	
								var localOpenPrice = Number(item.openPrice);
								var localClosePrice = Number(item.closePrice);
								var localBreakPoint = Number(item.breakPoint);
								var localQuantity = Number(item.quantity);
								var localOrderType = String(item.orderType);
								if(closingPrice<=localClosePrice&&numberAttempts===0)											
									{
										numberAttempts++;
										lastBalance = (localOpenPrice - closingPrice)*(balance/localOpenPrice) + balance;
										lastBalance -= lastBalance*0.0008;
										console.log('LocalWinningBalance '+lastBalance+' '+localSymbol);
										balance = lastBalance-0.02;
										var closingDate = new Date();										
										console.log('Attempting to close the sell order '+localSymbol+' '+closingDate);
										managingOrdersBinance(localSymbol,item,'deleteOrder').then((res) => {
											var response = Boolean(res.message);
											if(response)
												{
													sellOrders.splice(index,1);
													var sellClosingDate = new Date();
													console.log('Successfully deleting the sell order '+localSymbol+' '+sellClosingDate);
													readyForTrading = false;
												}
											else
												{
													var sellClosingDate = new Date();
													console.log('Failed deleting the sell order '+localSymbol+' '+sellClosingDate);
													numberAttempts--;
												}
										});																
									}
								if(closingPrice>=localBreakPoint&&numberAttempts===0)											
									{
										var losingBalance = (localOpenPrice - closingPrice)*(balance/localOpenPrice) + balance;
										console.log('LocalLosingBalance '+losingBalance+' '+localSymbol);
										console.log('LastBalance '+lastBalance);
										balance = losingBalance;
										numberAttempts++;
										var closingDate = new Date();										
										console.log('Attempting to close the sell order on breakpoint '+localSymbol+' '+closingDate);
										managingOrdersBinance(localSymbol,item,'deleteOrder').then((res) => {
											var response = Boolean(res.message);
											if(response)
												{
													sellOrders.splice(index,1);
													var sellClosingDate = new Date();
													console.log('Successfully deleting the sell order on breakpoint '+localSymbol+' '+sellClosingDate);
													readyForTrading = true;
												}
											else
												{
													var sellClosingDate = new Date();
													console.log('Failed deleting the sell order on breakpoint '+localSymbol+' '+sellClosingDate);
													numberAttempts--;
												}
										});
									}																					
							});
								
							if(currentDate>currentCloseTime)
							{
								lastHigh = 0; lastLow = 0; lowestATR = 0; readyForTrading = false;
								if(currentCloseTime!==0){
									lastKlineData(symbol,interval).then((res)=> {
										lastHigh = Number(res.high); lastLow = Number(res.low);
										var loadDataWebSocketVar = loadDataWebSocket(symbol,lowestATR);
										return Promise.resolve(loadDataWebSocketVar);
									}).then((res) => {
										lowestATR = Number(res.lowestATR); 
										console.log(lowestATR+' '+lastHigh+' '+lastLow+' '+symbol);
										readyForTrading = true;
										if(buyOrders.length!==0||sellOrders.length!==0){readyForTrading = false;}
									});
								}
								var candleData = Object(message.k);
								currentCloseTime = parseFloat(candleData.T)+120000;
							}
						};
						
						socket.onclose = function(event) 
						{
							var date = new Date();
							if (event.wasClean) {
								console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason} `+date+' '+symbol);	
							} else {
								console.log('[close] Connection died '+date+' '+symbol);
							}
						};
					
						socket.onerror = function(error) 
						{
							var date = new Date();
							console.log(`[error] ${error.message} `+date);
						};
					}
					
					startWebSocket();
					setInterval(function () {
						socket.close();
						socket = null;
						startWebSocket();
					}, 3600000);
			}
						/*
						* {"e":"kline","E":1616193759978,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238861,"o":"57641.00000000","c":"58402.74000000","h":"59468.00000000","l":"56270.74000000","v":"50460.12843600","n":1819603,"x":false,"q":"2940181959.97141612","V":"24618.24808700","Q":"1434862931.36678269","B":"0"}}
						*/			
}		

class Initializer
{
	
	constructor() 
		{
			
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
										
										console.log(JSON.stringify(sortedVolumes));
										
										var excludedSignals = ['XTZUSDT','ONTUSDT','IOTAUSDT','BATUSDT','VETUSDT','NEOUSDT','QTUMUSDT','IOSTUSDT','THETAUSDT','ALGOUSDT','ZILUSDT','KNCUSDT','ZRXUSDT','COMPUSDT','OMGUSDT','SXPUSDT','KAVAUSDT','BANDUSDT','RLCUSDT','WAVESUSDT','MKRUSDT','SNXUSDT','DEFIUSDT','YFIUSDT','BALUSDT','CRVUSDT','TRBUSDT','RUNEUSDT','SUSHIUSDT','SRMUSDT','EGLDUSDT','SOLUSDT','ICXUSDT','STORJUSDT','BLZUSDT','UNIUSDT','AVAXUSDT','HNTUSDT','ENJUSDT','FLMUSDT','TOMOUSDT','RENUSDT','KSMUSDT','AAVEUSDT','FILUSDT','RSRUSDT','LRCUSDT','OCEANUSDT','CVCUSDT','BELUSDT','CTKUSDT','AXSUSDT','ALPHAUSDT','ZENUSDT','SKLUSDT','GRTUSDT','INCHUSDT','AKROUSDT','CHZUSDT','SANDUSDT','ANKRUSDT','LUNAUSDT','BTSUSDT','LITUSDT','UNFIUSDT','DODOUSDT','REEFUSDT','RVNUSDT','SFPUSDT','XEMUSDT','BTCSTUSDT','COTIUSDT','CHRUSDT','MANAUSDT','ALICEUSDT','HBARUSDT','ONEUSDT','LINAUSDT','STMXUSDT','DENTUSDT','CELRUSDT','HOTUSDT','MTLUSDT','OGNUSDT','NKNUSDT','SCUSDT','DGBUSDT','SHIBUSDT','ICPUSDT','BAKEUSDT','GTCUSDT','BTCDOMUSDT','TLMUSDT','IOTXUSDT','AUDIOUSDT','RAYUSDT','C98USDT','MASKUSDT','ATAUSDT','DYDXUSDT','XECUSDT','CELOUSDT','ARUSDT','KLAYUSDT','ARPAUSDT','CTSIUSDT','LPTUSDT','ENSUSDT','PEOPLEUSDT','ANTUSDT','ROSEUSDT','DUSKUSDT','FLOWUSDT','IMXUSDT','API3USDT','ANCUSDT','GMTUSDT','APEUSDT','BNXUSDT','WOOUSDT','FTTUSDT','JASMYUSDT','DARUSDT','GALUSDT','LINKUSDT','1000SHIBUSDT','OPUSDT'];
										
										var index4;
										for(index4=0;index4<excludedSignals.length;index4++)
										{
											var index5;
											for(index5=0;index5<sortedVolumes.length;index5++)
												{
													var localSignal = String(sortedVolumes[index5].symbol);
													var currentSignal = String(excludedSignals[index4]);
													if(localSignal===currentSignal)
													{
														sortedVolumes.splice(index5,1);
													}
												}
										}
										
										sortedVolumes.splice(10,sortedVolumes.length-10);
										console.log(JSON.stringify(sortedVolumes));
										resolve(sortedVolumes);
									}										
								};
							
							xhttpRequest.open("GET", "https://fapi.binance.com/fapi/v1/ticker/24hr", true);
							xhttpRequest.send();
						
						});
					return await myPromise;
				}
				
			var initialMargin = async function(symbol)
				{	
					const myPromise = new Promise(function(resolve, reject) 
						{
							var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
							var xhttpRequest = new XMLHttpRequest();
							xhttpRequest.onerror = function()
								{
									console.log('initialMargin error');
									var jsonResponse = {};
									resolve(jsonResponse);
								};
							xhttpRequest.onreadystatechange = function() 
								{
									if (this.readyState === 4 && this.status === 200) 
									{
										var jsonResponse = JSON.parse(this.responseText);
										console.log(JSON.stringify(jsonResponse));
										resolve(true);
									}										
								};
							xhttpRequest.open("GET", "http://localhost:8091/tradingbot/marginType?symbol="+symbol, true);
							xhttpRequest.send();
						});
					return await myPromise;
				}
			
			var initialLeverage = async function(symbol)
				{	
					const myPromise = new Promise(function(resolve, reject) 
						{
							var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
							var xhttpRequest = new XMLHttpRequest();
							xhttpRequest.onerror = function()
								{
									console.log('initialLeverage error');
									var jsonResponse = {};
									resolve(jsonResponse);
								};
							xhttpRequest.onreadystatechange = function() 
								{
									if (this.readyState === 4 && this.status === 200) 
									{
										var jsonResponse = JSON.parse(this.responseText);
										console.log(JSON.stringify(jsonResponse));
										resolve(true);
									}										
								};
							xhttpRequest.open("GET", "http://localhost:8091/tradingbot/initialLeverage?symbol="+symbol, true);
							xhttpRequest.send();
						});
					return await myPromise;
				}
			
			function init()
				{
					tickerStatistics().then((sortedVolumes) => { 
						var sortedVolumesResult = sortedVolumes;
						if(Object.keys(sortedVolumes).length===0)
						{
							init();
						}
						else
						{
							var resultingArray = [];
							var symbols = [];
							sortedVolumesResult.forEach(function(item,index) 
							{
								var localSymbol = String(item.symbol);
								var localSymbolLW = localSymbol.toLowerCase();
								initialMargin(localSymbol).then(() => {
									initialLeverage(localSymbol).then(() => {
										new Bot(localSymbol,localSymbolLW);
									}); 
								});
							});								
						}
					});
				}
			init();
		}
}

new Initializer();
