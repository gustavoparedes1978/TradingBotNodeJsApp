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
 
 /*
  * {"e":"kline","E":1616193759978,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238861,"o":"57641.00000000","c":"58402.74000000","h":"59468.00000000","l":"56270.74000000","v":"50460.12843600","n":1819603,"x":false,"q":"2940181959.97141612","V":"24618.24808700","Q":"1434862931.36678269","B":"0"}}{"e":"kline","E":1616193762262,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238876,"o":"57641.00000000","c":"58402.74000000","h":"59468.00000000","l":"56270.74000000","v":"50460.23431800","n":1819618,"x":false,"q":"2940188143.76935560","V":"24618.25624900","Q":"1434863408.04994657","B":"0"}}{"e":"kline","E":1616193764425,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238890,"o":"57641.00000000","c":"58402.75000000","h":"59468.00000000","l":"56270.74000000","v":"50460.43046000","n":1819632,"x":false,"q":"2940199598.99099875","V":"24618.40471400","Q":"1434872078.81473723","B":"0"}}{"e":"kline","E":1616193766744,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238899,"o":"57641.00000000","c":"58403.92000000","h":"59468.00000000","l":"56270.74000000","v":"50460.45143700","n":1819641,"x":false,"q":"2940200824.11555552","V":"24618.40555400","Q":"1434872127.87342027","B":"0"}}{"e":"kline","E":1616193768872,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238959,"o":"57641.00000000","c":"58378.73000000","h":"59468.00000000","l":"56270.74000000","v":"50461.85854800","n":1819701,"x":false,"q":"2940282986.06547119","V":"24619.11401400","Q":"1434913496.57090882","B":"0"}}{"e":"kline","E":1616193771019,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238973,"o":"57641.00000000","c":"58377.33000000","h":"59468.00000000","l":"56270.74000000","v":"50462.09353700","n":1819715,"x":false,"q":"2940296704.18609267","V":"24619.14805000","Q":"1434915483.59197442","B":"0"}}{"e":"kline","E":1616193773060,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238985,"o":"57641.00000000","c":"58377.34000000","h":"59468.00000000","l":"56270.74000000","v":"50462.12410700","n":1819727,"x":false,"q":"2940298488.78129756","V":"24619.17072900","Q":"1434916807.53166828","B":"0"}}{"e":"kline","E":1616193775082,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717239010,"o":"57641.00000000","c":"58371.01000000","h":"59468.00000000","l":"56270.74000000","v":"50462.79388000","n":1819752,"x":false,"q":"2940337584.55443667","V":"24619.37525300","Q":"1434928746.11972294","B":"0"}}{"e":"kline","E":1616193777092,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717239042,"o":"57641.00000000","c":"58363.82000000","h":"59468.00000000","l":"56270.74000000","v":"50463.31400600","n":1819784,"x":false,"q":"2940367941.48342569","V":"24619.67337900","Q":"1434946145.67839644","B":"0"}}{"e":"kline","E":1616193779330,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717239060,"o":"57641.00000000","c":"58364.31000000","h":"59468.00000000","l":"56270.74000000","v":"50463.63122300","n":1819802,"x":false,"q":"2940386455.69465602","V":"24619.88538800","Q":"1434958519.19320563","B":"0"}}
  */
 
 /* 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M */

var buyOrderOpenMin = 0;
var buyOrderClose = 0;
var sellOrderOpenMin = 0;
var sellOrderClose = 0;

var lowestATR = 0;

var buyOpenOrderBoolean = true;
var buyCloseOrderBoolean = false;
var counterbuy = 0;

var sellOpenOrderBoolean = true;
var sellCloseOrderBoolean = false;
var countersell = 0;

var currentCloseTime = 0;
var readyForTrading = false;

var interval = localStorage.getItem('interval');
var symbol = localStorage.getItem('symbol');
var symbolStream = "btcusdt";
var stream = "@kline_"+interval;
var streamName = symbolStream+stream;
let socket = new WebSocket("wss://stream.binance.com:9443/ws/"+streamName);
startWebSocket(socket,streamName);

function loadDataWebSocket()
{
    var xhttpRequest = new XMLHttpRequest();
    xhttpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

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
  
    xhttpRequest.open("GET", "https://api.binance.com/api/v3/klines?symbol="+symbol+"&interval="+interval+"&limit=1000", true);
    xhttpRequest.send();
}



function startWebSocket(socket,streamName)
{
    
    if(localStorage.getItem('buyOrderOpenMin')!==null){buyOrderOpenMin=parseFloat(localStorage.getItem('buyOrderOpenMin'));}
    if(localStorage.getItem('buyOrderClose')!==null){buyOrderClose=parseFloat(localStorage.getItem('buyOrderClose'));}
    if(localStorage.getItem('counterbuy')!==null){counterbuy=parseInt(localStorage.getItem('counterbuy'));}
    if(localStorage.getItem('buyOpenOrderBoolean')!==null){buyOpenOrderBoolean=eval(localStorage.getItem('buyOpenOrderBoolean'));}
    if(localStorage.getItem('buyCloseOrderBoolean')!==null){buyCloseOrderBoolean=eval(localStorage.getItem('buyCloseOrderBoolean'));}

    if(localStorage.getItem('sellOrderOpenMin')!==null){sellOrderOpenMin=parseFloat(localStorage.getItem('sellOrderOpenMin'));}
    if(localStorage.getItem('sellOrderClose')!==null){sellOrderClose=parseFloat(localStorage.getItem('sellOrderClose'));}
    if(localStorage.getItem('countersell')!==null){countersell=parseInt(localStorage.getItem('countersell'));}
    if(localStorage.getItem('sellOpenOrderBoolean')!==null){sellOpenOrderBoolean=eval(localStorage.getItem('sellOpenOrderBoolean'));}
    if(localStorage.getItem('sellCloseOrderBoolean')!==null){sellCloseOrderBoolean=eval(localStorage.getItem('sellCloseOrderBoolean'));}

    if(localStorage.getItem('currentCloseTime')!==null){currentCloseTime=parseFloat(localStorage.getItem('currentCloseTime'));}
    if(localStorage.getItem('readyForTrading')!==null){readyForTrading=eval(localStorage.getItem('readyForTrading'));}
    
    console.log(buyOrderClose+' '+sellOrderClose);
    
    socket.onopen = function(event) 
    {
        var date = new Date();
        console.log('socket state onopen '+socket.readyState+' '+date);
        var message = "{\"method\": \"SUBSCRIBE\",\"params\": [\""+streamName+"\"],\"id\": \"1\" }";
        if(socket.readyState===0){socket.send(message);}
        lowestATR = localStorage.getItem('ATR_SMAs_Array');
        console.log('lowestATR '+lowestATR);  
    };

    
    socket.onmessage = function(event) 
    {
        var date = new Date();
        console.log('socket state onmessage '+socket.readyState+' '+date);
        if(localStorage.getItem('currentCloseTime')!==null)
        {
            currentCloseTime = parseInt(localStorage.getItem('currentCloseTime'));
        }
        
        var candle = JSON.parse(event.data);
        var currentDate = parseInt(new Date().getTime()); //get current time in milliseconds
        var closingPrice = parseFloat(candle.k.c);
        
        if(closingPrice>=buyOrderOpenMin&&buyOrderOpenMin!==0&&buyOpenOrderBoolean&&counterbuy===0)
        {
            counterbuy++;
            localStorage.setItem('counterbuy',counterbuy);
            console.log("buy order open "+closingPrice+" "+date);
            buyOpenOrderBoolean = false; buyCloseOrderBoolean = true;
            localStorage.setItem('buyOpenOrderBoolean',buyOpenOrderBoolean);
            localStorage.setItem('buyCloseOrderBoolean',buyCloseOrderBoolean);
            localStorage.setItem('counterbuy',counterbuy);
        }
        if(closingPrice>=buyOrderClose&&buyOrderClose!==0&&buyCloseOrderBoolean)
        {
            console.log("buy order close "+closingPrice+" "+date);
            buyOpenOrderBoolean = true; buyCloseOrderBoolean = false;
            localStorage.setItem('buyOpenOrderBoolean',buyOpenOrderBoolean);
            localStorage.setItem('buyCloseOrderBoolean',buyCloseOrderBoolean);
        }
        
        if(closingPrice<=sellOrderOpenMin&&sellOrderOpenMin!==0&&sellOpenOrderBoolean&&countersell===0)
        {
            countersell++;
            localStorage.setItem('countersell',countersell);
            console.log("sell order open "+closingPrice+" "+date);
            sellOpenOrderBoolean = false; sellCloseOrderBoolean = true;
            localStorage.setItem('sellOpenOrderBoolean',sellOpenOrderBoolean);
            localStorage.setItem('sellCloseOrderBoolean',sellCloseOrderBoolean);
            
        }
        if(closingPrice<=sellOrderClose&&sellOrderClose!==0&&sellCloseOrderBoolean)
        {
            console.log("sell order close "+closingPrice+" "+date);
            sellOpenOrderBoolean = true; sellCloseOrderBoolean = false;
            localStorage.setItem('sellOpenOrderBoolean',sellOpenOrderBoolean);
            localStorage.setItem('sellCloseOrderBoolean',sellCloseOrderBoolean);
        }
  
        if(currentDate>currentCloseTime)
        {
            if(currentCloseTime!==0)
            {
                readyForTrading = true;
                localStorage.setItem('readyForTrading',readyForTrading);
                
                buyOpenOrderBoolean = true;     buyCloseOrderBoolean = false;
                sellOpenOrderBoolean = true;    sellCloseOrderBoolean = false;
                counterbuy = 0;                 countersell = 0;
                localStorage.setItem('buyOpenOrderBoolean',buyOpenOrderBoolean);
                localStorage.setItem('buyCloseOrderBoolean',buyCloseOrderBoolean);
                localStorage.setItem('sellOpenOrderBoolean',sellOpenOrderBoolean);
                localStorage.setItem('sellCloseOrderBoolean',sellCloseOrderBoolean);
                localStorage.setItem('counterbuy',counterbuy);
                localStorage.setItem('countersell',countersell);
            }
            
            loadDataWebSocket();
            lowestATR = parseFloat(localStorage.getItem('ATR_SMAs_Array'));//obtener minimo ATR
            console.log('closeTime '+localStorage.getItem('currentCloseTime'));

            currentPrice = closingPrice;
            console.log('currentPrice '+currentPrice);
            
            if(readyForTrading)
            {
                buyOrderOpenMin = currentPrice + lowestATR*0.80;
                buyOrderClose = currentPrice + lowestATR;
                
                var div = buyOrderOpenMin/buyOrderClose;
                var diff2 = currentPrice - buyOrderClose;
                console.log('currentPrice - buyOrderClose ' + Math.abs(diff2));
                console.log('buyOrderOpenMin '+buyOrderOpenMin);
                console.log('buyOrderClose '+buyOrderClose);
                console.log('division '+div);
                console.log(Math.abs(1 - div));
                
                sellOrderOpenMin = currentPrice - lowestATR*0.80;
                sellOrderClose = currentPrice - lowestATR;
            
                div = sellOrderOpenMin/sellOrderClose;
                var diff2 = currentPrice - sellOrderClose;
                console.log('currentPrice - sellOrderClose '+Math.abs(diff2));
                console.log('sellOrderOpenMin '+sellOrderOpenMin);
                console.log('sellOrderClose '+sellOrderClose);
                console.log('division '+div);
                console.log(Math.abs(1 - div));
                
                localStorage.setItem('buyOrderOpenMin',buyOrderOpenMin);
                localStorage.setItem('buyOrderClose',buyOrderClose);
                localStorage.setItem('sellOrderOpenMin',sellOrderOpenMin);
                localStorage.setItem('sellOrderClose',sellOrderClose);
            }
            localStorage.setItem('currentCloseTime',candle.k.T);
            currentCloseTime = candle.k.T;
        }
    };

    socket.onclose = function(event) {
        var date = new Date();
        console.log('socket state onclose '+socket.readyState+' '+date);
        if (event.wasClean) {
            var date = new Date();
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason} `+date);
        } else {
            date = new Date();
            console.log('[close] Connection died '+date);
        }
        location.reload();
    };

    socket.onerror = function(error) {
        var date = new Date();
        console.log('socket state onerror '+socket.readyState+' '+date);
        console.log(`[error] ${error.message}`);
        location.reload();
    };

}