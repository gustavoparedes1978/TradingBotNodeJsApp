/*var i = 0;
var counterStopLoss = 0;
var jsonResponse = [{"orderId":43961805564,"symbol":"BTCUSDT","status":"NEW","clientOrderId":"ouk07hQWPX4NKgzOzaDfw6","price":"0","avgPrice":"0","origQty":"0.001","executedQty":"0","cumQuote":"0","timeInForce":"GTC","type":"TAKE_PROFIT_MARKET","reduceOnly":true,"closePosition":false,"side":"SELL","positionSide":"LONG","stopPrice":"40970.30","workingType":"CONTRACT_PRICE","priceProtect":false,"origType":"TAKE_PROFIT_MARKET","time":1645133508519,"updateTime":1645133508519},{"orderId":43961807217,"symbol":"BTCUSDT","status":"NEW","clientOrderId":"qtF5hebLeBoCIAbQx9Atwt","price":"0","avgPrice":"0","origQty":"0.001","executedQty":"0","cumQuote":"0","timeInForce":"GTC","type":"STOP_MARKET","reduceOnly":true,"closePosition":false,"side":"SELL","positionSide":"LONG","stopPrice":"40131.60","workingType":"CONTRACT_PRICE","priceProtect":false,"origType":"STOP_MARKET","time":1645133509000,"updateTime":1645133509000},{"orderId":43969003889,"symbol":"BTCUSDT","status":"NEW","clientOrderId":"CF0Sox09lvyPKFisEMmsbd","price":"0","avgPrice":"0","origQty":"0.001","executedQty":"0","cumQuote":"0","timeInForce":"GTC","type":"TAKE_PROFIT_MARKET","reduceOnly":true,"closePosition":false,"side":"SELL","positionSide":"LONG","stopPrice":"40819.60","workingType":"CONTRACT_PRICE","priceProtect":false,"origType":"TAKE_PROFIT_MARKET","time":1645140228000,"updateTime":1645140228000}];
var code = jsonResponse.code;

if(typeof code === "undefined")
{
	console.log('undefined');
}

for(i = 0;i < jsonResponse.length;i++)
{
	var type = String(jsonResponse[i].type);
	if(type==="STOP_MARKET"){counterStopLoss++;}
}
console.log(counterStopLoss);
*/

var fs = require("fs");
var buyOrders = [];
var sellOrders = [];
var symbol = "BTCUSDT";

fs.open(symbol+'order.txt', 'r', function (err, file) {
	if (err)
	{
		console.log('Order not available '+symbol);
	}
	else
	{
		fs.readFile(symbol+'order.txt', function(err, data) {
			var order = JSON.parse(data);
			console.log(JSON.stringify(order));
			var orderType = String(order.orderType);
			if(orderType==="buyOrder"){buyOrders.push(order);}
			if(orderType==="sellOrder"){sellOrders.push(order);}
			fs.unlinkSync("BTCUSDTorder.txt");
		});
	}
});

