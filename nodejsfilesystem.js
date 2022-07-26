var fs = require('fs');
var balance = 0;
var lastBalance = 0;
var symbol = 'BTCUSDT';
fs.open(symbol+'.txt', 'r', function (err, file) {
	if (err)
	{
		fs.writeFile(symbol+'.txt', String(25), function (err) {console.log('balance');});
	}
	else
	{
		fs.readFile(symbol+'.txt', function(err, data) {
			balance = Number(data);
			lastBalance = balance+0.02;
			console.log(balance);
			console.log(lastBalance);
		});
		
	}
});