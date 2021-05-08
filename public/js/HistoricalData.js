/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* drawing a box */
 /*
  * [
  [
    1499040000000,      // Open time
    "0.01634790",       // Open
    "0.80000000",       // High
    "0.01575800",       // Low
    "0.01577100",       // Close
    "148976.11427815",  // Volume
    1499644799999,      // Close time
    "2434.19055334",    // Quote asset volume
    308,                // Number of trades
    "1756.87402397",    // Taker buy base asset volume
    "28.46694368",      // Taker buy quote asset volume
    "17928899.62484339" // Ignore.
  ]
]
  */

 /* 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M */
localStorage.setItem('interval','8h');
localStorage.setItem('symbol','BTCUSDT');
var symbol = localStorage.getItem('symbol');
var interval = localStorage.getItem('interval');

var xhttpATR = new XMLHttpRequest();
xhttpATR.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {

        //document.getElementById("demo").innerHTML = this.responseText;
        var array = JSON.parse(this.responseText);
        var x;
        var limit;
        var sum;
        var divider = 0;
        console.log('arraylength '+array.length);
        var reversalValueId = document.getElementById("reversalValue");

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
            var option = document.createElement("option");

            option.text = "ATR SMA "+sumSMA+" ";
            option.value = sumSMA;
            reversalValueId.add(option);

            ATR_SMAs_Array.push(sumSMA);  
        }

        ATR_SMAs_Array.sort(function(a, b){return a - b});
        console.log(ATR_SMAs_Array[0]);
        
        localStorage.setItem('ATR_SMAs_Array',ATR_SMAs_Array[0]);

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
        drawChart(data,ATR_SMAs_Array[0]);

        //EMA exponential moving average with alpha = 1/length
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

    }
};
  
   /* 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M */
  
    xhttpATR.open("GET", "https://api.binance.com/api/v3/klines?symbol="+symbol+"&interval="+interval+"&limit=1000", true);
    xhttpATR.send();

 
           

