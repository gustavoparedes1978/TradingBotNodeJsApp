

var SQL = async function(symbol,info,operation,allowedToTrade)
{
	const mysqlx = require('@mysql/xdevapi');
	const config = {schema: 'BOTFUTURES', table: 'orders', user: 'root', passwd:'GaPo2030$$$1978'};
	const myPromise = new Promise(function(resolve, reject) {
		mysqlx.getSession({ user: config.user, password: config.passwd }).then(session => {
			const table = session.getSchema(config.schema).getTable(config.table);
			if(operation==="insert")
			{
				table.insert('symbol', 'balance')
					.values(symbol,info)
					.execute()
					.then(() => {
						return table.select('balance')
						.execute()
					})
					.then(res => {
						info = res.fetchAll();
						resolve(info);
					})
					.then(() => {
						return session.close();
					});
				
			}
			if(operation==="update")
			{
				table.update()
					.where('symbol = :symbol')
					.bind('symbol',symbol)
					.set('balance',info)
					.execute()
					.then(() => {
						return table.select('info')
						.execute()
					})
					.then(res => {
						info = res.fetchAll();
						resolve(info);
					})
					.then(() => {
						return session.close();
					});
			}
			if(operation==="delete")
			{
				table.delete()
					.where('symbol = :symbol')
					.bind('symbol',symbol)
					.execute()
					.then(() => {
						return table.select('info')
						.execute()
					})
					.then(res => {
						info = res.fetchAll();
						resolve(info);
					})
					.then(() => {
						return session.close();
					});		
			}
			if(operation==="select")
			{
				table.select('info')
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
						console.log('Reset error: ' + err.message);
					});
			}
			if(operation==="switch")
			{
				table.update()
					.where('symbol = :symbol')
					.bind('symbol',symbol)
					.set('allowedToTrade',true)
					.execute()
					.then(() => {
						resolve(true);
					})
					.then(() => {
						return session.close();
					})
					.catch (function (err) {
						console.log('Switch error: ' + err.message);
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
					});
			}
		});	
		
	});
	return await myPromise;
}

var buyOrders = [];
var sellOrders = [];
var info = {};
var symbol = 'SIGNALUSDT';
SQL(symbol,{},'select',false).then((res) => {
	console.log('retrieving existing orders... SIGNALUSDT');
	console.log(JSON.stringify(res));
	var orders = Object(res);
	orders.forEach(function (item,index) {
		var JSONObject = JSON.parse(String(item));
		var localATR = Number(JSONObject.ATR);
		var localBalance = Number(JSONObject.balance);
		var localOpenPrice = Number(JSONObject.openPrice);
		var localOrderType = String(JSONObject.orderType);
		var localClosePrice = Number(JSONObject.closePrice);
		var localPercentage = Number(JSONObject.percentage);
		var localBreakPoint = Number(JSONObject.breakPoint);
		var numberAttempts = Number(JSONObject.numberAttempts);
		var orderIdLimit = Number(JSONObject.orderIdLimit);
		var orderIdStopLoss = Number(JSONObject.orderIdStopLoss);
		var orderIdTakeProfit = Number(JSONObject.orderIdTakeProfit);
		var localQuantity = Number(JSONObject.quantity);
		var localSymbol = String(JSONObject.symbol);
		var activeOrder = Boolean(JSONObject.activeOrder);
		var info = {"symbol":localSymbol,"openPrice":localOpenPrice,"closePrice":localClosePrice,"breakPoint":localBreakPoint,"quantity":localQuantity,"ATR":localATR,"percentage":localPercentage,"balance":localBalance,"orderType":localOrderType,"numberAttempts":numberAttempts,"orderIdLimit":orderIdLimit,"orderIdStopLoss":orderIdStopLoss,"orderIdTakeProfit":orderIdTakeProfit,"activeOrder":activeOrder};
		console.log(JSON.stringify(info));
		if(JSONObject.orderType==="buyOrder"){buyOrders.push(info);console.log(localOrderType);}
		if(JSONObject.orderType==="sellOrder"){sellOrders.push(info);console.log(localOrderType);}
		
		if(buyOrders.length===0&&sellOrders.length===0){console.log('1');}
		else
		{console.log('2');}
		
	});	
});



/*
var arr = ["apple", "mango", "apple", 
            "orange", "mango", "mango"];
  
    function removeDuplicates(arr) {
        return arr.filter((item, 
            index) => arr.indexOf(item) === index);
    }
  
    console.log(removeDuplicates(arr));

var array1 = ["1","1","4","5"];
var array2 = ["1","2","3"];
var array3 = [];
var index1; var index2;
for(index1 = 0;index1<array1.length;index1++)
{
	var element1 = String(array1[index1]);
	for(index2 = 0;index2<array2.length;index2++)
		{
			var element2 = String(array2[index2]);
			if(element1===element2)
				{
					array1.splice(index1,1);
				}
		}
}
console.log(JSON.stringify(array1));
console.log(JSON.stringify(array2));
console.log(JSON.stringify(array3));

*/
