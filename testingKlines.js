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

			console.log(lowestATRLocal);
			
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
			
			
			//drawChart(data,ATR_SMAs_Array[0]);

			//RMA exponential moving average with alpha = 1/length
			
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
			*/
			}
			console.log(lowestATRLocal);
	};

xhttpRequest.open("GET", "https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1d&limit=1000", true);
xhttpRequest.send();