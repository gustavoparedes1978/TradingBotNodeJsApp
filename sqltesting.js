

var SQL = async function(symbol,info,operation)
{
	const mysqlx = require('@mysql/xdevapi');
	const config = {schema: 'BOT', table: 'balances', user: 'root', passwd:'GaPo2030$$$1978'};
	const myPromise = new Promise(function(resolve, reject) {
		mysqlx.getSession({ user: config.user, password: config.passwd }).then(session =>{
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
				table.select('allowedToTrade')
					.where('symbol = :symbol')
					.bind('symbol',symbol)
					.execute()
					.then(res => {
						info = res.fetchAll();
						console.log(info);
						resolve(info);
					})
					.then(() => {
						return session.close();
					})
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
					.set('allowedToTrade',false)
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

var info = {};

SQL("",info,'pending').then((res) => {
	console.log(res);
	res.forEach(function (item,index) {
		console.log(String(item));
	});
});


