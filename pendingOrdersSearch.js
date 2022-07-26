const fs = require('fs');
						
fs.readdir('./orders/', (err, files) => {
	if (err) {
		throw err;
	}

	// files object contains all files names
	// log them on console
		files.forEach(file => {
			console.log(file);
		});
});

var chars = ['BTCUSDT', 'BTCUSDT', 'ETHUSDT', 'GALAUSDT', 'XRPUSDT'];
var uniqueChars = [...new Set(chars)];

console.log(uniqueChars);

fs.writeFile('./orders/BTCUSDT', 'BTCUSDTalgo', function (err) {});
