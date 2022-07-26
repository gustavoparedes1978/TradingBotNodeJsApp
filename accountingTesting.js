var winningBalance =  24.98;
var sellOrderPlacement = 0;
var percentage = 0.10;
var lastBalance = 25;
var closingPrice = 40954.9;
var lowestATR = 1128.8999999999978;
while(winningBalance<lastBalance)
	{
		percentage += 0.01;
		percentage = Number(percentage);
		sellOrderPlacement = closingPrice - (lowestATR)*percentage;
		sellOrderPlacement = Number(sellOrderPlacement);
		winningBalance = ((closingPrice - sellOrderPlacement)*(winningBalance/closingPrice))-(winningBalance)*0.0002+winningBalance;
		console.log(sellOrderPlacement+' '+percentage+' '+winningBalance);
	}
var diff = winningBalance-24.98;
console.log(diff);