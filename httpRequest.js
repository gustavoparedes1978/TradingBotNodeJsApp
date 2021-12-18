var http = require('http');

// testNewOrder?symbol=symbol&side=BUY&type=LIMIT&timeInForce=GTC&quantity=quantity&stopPrice=0&price=price;
// testNewOrder?symbol=symbol&side=SELL&type=STOP_LOSS_LIMIT&timeInForce=GTC&quantity=quantity&stopPrice=price&price=price2;

//pulling out symbol information

var symbol = 'BTCUSDT';
var http = require('http');
							
var counterPrecision = 1;
var counterPrecisionQuantity = 1;

var options = 
	{
	  host: 'localhost',
	  port: 8090,
	  path: '/tradingbot/exchangeInformation?symbol='+symbol
	}; 

var callback = function(response) {
  var str = '';

  response.on('data', function (chunk) {
	str += chunk;
  });

  response.on('end', function () {
	console.log(str);
	var jsonObject = JSON.parse(str);
	var tickSize = jsonObject.symbols[0].filters[0].tickSize;
	var tickSizeQuantity = jsonObject.symbols[0].filters[2].minQty;
	console.log('tickSizeQuantity '+tickSizeQuantity);
	console.log('tickSize '+tickSize);
	var findingTickSize = 1;
	while((tickSize/findingTickSize)!==1){findingTickSize/=10;counterPrecision++;}
	var findingTickSizeQuantity = 1;
	while((tickSizeQuantity/findingTickSizeQuantity)!==1){findingTickSizeQuantity/=10;counterPrecisionQuantity++;}
	var type = 'LIMIT';
	var stopPrice = 60000;
	stopPrice = stopPrice.toFixed(counterPrecision);
	var quantity = 2000/stopPrice;
	console.log("quantity "+quantity);
	quantity = quantity.toFixed(counterPrecisionQuantity);
	var closingPrice = 62000;
	closingPrice = closingPrice.toFixed(counterPrecision);
	console.log('quantityFixed '+quantity);
  });
}

http.request(options, callback).end();

/*
if(info.orderType==="buyOrder"){localSide="BUY";localStopSide="SELL";}
if(info.orderType==="sellOrder"){localSide="SELL";localStopSide="BUY";}
*/
