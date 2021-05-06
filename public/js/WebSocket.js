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

var interval = sessionStorage.getItem('interval');
var symbol = sessionStorage.getItem('symbol');
var symbolStream = "btcusdt";
var stream = "@kline_"+interval;
var streamName = symbolStream+stream;
let socket = new WebSocket("wss://stream.binance.com:9443/ws/"+streamName);
socket = startWebSocket(socket,streamName);

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
            sessionStorage.setItem('ATR_SMAs_Array',ATR_SMAs_Array[0]);

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
            drawChart(data);

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

var buyOrderOpenMin = 0;
var buyOrderOpenMax = 0;
var buyOrderClose = 0;
var sellOrderOpenMin = 0;
var sellOrderOpenMax = 0;
var sellOrderClose = 0;

var lowestATR = 0;

var buyOpenOrderBoolean = true;
var buyCloseOrderBoolean = false;
var counterbuy = 0;

var sellOpenOrderBoolean = true;
var sellCloseOrderBoolean = false;
var countersell = 0;

sessionStorage.setItem('currentCloseTime',0);
var currentCloseTime = 0;
sessionStorage.setItem('readyForTrading','false');

function startWebSocket(socket,streamName)
{
    if(sessionStorage.getItem('buyOrderOpenMin')!==null){buyOrderOpenMin=parseInt(sessionStorage.getItem('buyOrderOpenMin'));}
    if(sessionStorage.getItem('buyOrderOpenMax')!==null){buyOrderOpenMax=parseInt(sessionStorage.getItem('buyOrderOpenMax'));}
    if(sessionStorage.getItem('buyOrderClose')!==null){buyOrderClose=parseInt(sessionStorage.getItem('buyOrderClose'));}
    if(sessionStorage.getItem('counterbuy')!==null){counterbuy=parseInt(sessionStorage.getItem('counterbuy'));}
    if(sessionStorage.getItem('buyCloseOrderBoolean')!==null){buyCloseOrderBoolean=parseInt(sessionStorage.getItem('buyCloseOrderBoolean'));}

    if(sessionStorage.getItem('sellOrderOpenMin')!==null){sellOrderOpenMin=parseInt(sessionStorage.getItem('sellOrderOpenMin'));}
    if(sessionStorage.getItem('sellOrderOpenMax')!==null){sellOrderOpenMax=parseInt(sessionStorage.getItem('sellOrderOpenMax'));}
    if(sessionStorage.getItem('sellOrderClose')!==null){sellOrderClose=parseInt(sessionStorage.getItem('sellOrderClose'));}
    if(sessionStorage.getItem('countersell')!==null){countersell=parseInt(sessionStorage.getItem('countersell'));}
    if(sessionStorage.getItem('sellCloseOrderBoolean')!==null){sellCloseOrderBoolean=parseInt(sessionStorage.getItem('sellCloseOrderBoolean'));}

    socket.onopen = function(event) 
    {
        console.log('socket state onopen '+socket.readyState);
        var message = "{\"method\": \"SUBSCRIBE\",\"params\": [\""+streamName+"\"],\"id\": \"1\" }";
        if(socket.readyState===0){socket.send(message);}
        lowestATR = sessionStorage.getItem('ATR_SMAs_Array');
        console.log('lowestATR '+lowestATR);  
    };

    
    socket.onmessage = function(event) 
    {
        if(sessionStorage.getItem('currentCloseTime')!==null)
        {
            currentCloseTime = parseInt(sessionStorage.getItem('currentCloseTime'));
        }
        
        var candle = JSON.parse(event.data);
        var currentDate = parseInt(new Date().getTime()); //get current time in milliseconds
        var closingPrice = parseFloat(candle.k.c);
        var date = new Date();
        
        if(closingPrice>=buyOrderOpenMin&&closingPrice<=buyOrderOpenMax&&buyOrderOpenMin!==0&&buyOpenOrderBoolean&&counterbuy===0)
        {
            counterbuy++;
            sessionStorage.setItem('counterbuy',counterbuy);
            console.log("buy order open "+closingPrice+" "+date);
            buyOpenOrderBoolean = false; buyCloseOrderBoolean = true;
            sessionStorage.setItem('buyOpenOrderBoolean','false');
            sessionStorage.setItem('buyCloseOrderBoolean','true');
        }
        if(closingPrice>=buyOrderClose&&buyOrderClose!==0&&buyCloseOrderBoolean)
        {
            console.log("buy order close "+closingPrice+" "+date);
            buyOpenOrderBoolean = true; buyCloseOrderBoolean = false;
            sessionStorage.setItem('buyOpenOrderBoolean','true');
            sessionStorage.setItem('buyCloseOrderBoolean','false');
        }
        
        if(closingPrice<=sellOrderOpenMin&&closingPrice>=sellOrderOpenMax&&sellOrderOpenMin!==0&&sellOpenOrderBoolean&&countersell===0)
        {
            countersell++;
            sessionStorage.setItem('countersell',countersell);
            console.log("sell order open "+closingPrice+" "+date);
            sellOpenOrderBoolean = false; sellCloseOrderBoolean = true;
            sessionStorage.setItem('sellOpenOrderBoolean','false');
            sessionStorage.setItem('sellCloseOrderBoolean','true');
            
        }
        if(closingPrice<=sellOrderClose&&sellOrderClose!==0&&sellCloseOrderBoolean)
        {
            console.log("sell order close "+closingPrice+" "+date);
            sellOpenOrderBoolean = true; sellCloseOrderBoolean = false;
            sessionStorage.setItem('sellOpenOrderBoolean','true');
            sessionStorage.setItem('sellCloseOrderBoolean','false');
        }
  
        if(currentDate>parseInt(sessionStorage.getItem('currentCloseTime')))
        {
            if(parseInt(sessionStorage.getItem('currentCloseTime'))!==0)
            {
                sessionStorage.setItem('readyForTrading','true');
            }
            
            buyOpenOrderBoolean = true;     buyCloseOrderBoolean = false;
            sellOpenOrderBoolean = true;    sellCloseOrderBoolean = false;
            counterbuy=0;                   countersell=0;
            sessionStorage.setItem('buyOpenOrderBoolean',buyOpenOrderBoolean);
            sessionStorage.setItem('buyCloseOrderBoolean',buyCloseOrderBoolean);
            sessionStorage.setItem('sellOpenOrderBoolean',sellOpenOrderBoolean);
            sessionStorage.setItem('sellCloseOrderBoolean',sellCloseOrderBoolean);
            sessionStorage.setItem('counterbuy',counterbuy);
            sessionStorage.setItem('countersell',countersell);
            
            loadDataWebSocket();
            lowestATR = parseFloat(sessionStorage.getItem('ATR_SMAs_Array'));//obtener minimo ATR
            console.log('closeTime '+sessionStorage.getItem('currentCloseTime'));

            currentPrice = closingPrice;
            console.log('currentPrice '+currentPrice);
            
            if(sessionStorage.getItem('readyForTrading')==='true')
            {
                buyOrderOpenMin = currentPrice + lowestATR*0.40;
                buyOrderOpenMax = currentPrice + lowestATR*0.41;
                buyOrderClose = currentPrice + lowestATR*0.60;
                
                var div = buyOrderOpenMin/buyOrderClose;
                var diff = buyOrderOpenMax - buyOrderClose;
                var diff2 = currentPrice - buyOrderClose;
                console.log('currentPrice - buyOrderClose '+Math.abs(diff2));
                console.log('buyOrderOpenMax - buyOrderClose '+Math.abs(diff));
                console.log('buyOrderOpenMin '+buyOrderOpenMin);
                console.log('buyOrderOpenMax '+buyOrderOpenMax);
                console.log('buyOrderClose '+buyOrderClose);
                console.log('division '+div);
                console.log(Math.abs(1 - div));
                
                sellOrderOpenMin = currentPrice - lowestATR*0.40;
                sellOrderOpenMax = currentPrice - lowestATR*0.41;
                sellOrderClose = currentPrice - lowestATR*0.60;
            
                div = sellOrderOpenMin/sellOrderClose;
                var diff = sellOrderOpenMax - sellOrderClose;
                var diff2 = currentPrice - sellOrderClose;
                console.log('currentPrice - sellOrderClose '+Math.abs(diff2));
                console.log('sellOrderOpenMax - sellOrderClose '+Math.abs(diff));
                console.log('sellOrderOpenMin '+sellOrderOpenMin);
                console.log('sellOrderOpenMax '+sellOrderOpenMax);
                console.log('sellOrderClose '+sellOrderClose);
                console.log('division '+div);
                console.log(Math.abs(1 - div));
                
                sessionStorage.setItem('buyOrderOpenMin',buyOrderOpenMin);
                sessionStorage.setItem('buyOrderOpenMax',buyOrderOpenMax);
                sessionStorage.setItem('buyOrderClose',buyOrderClose);
                sessionStorage.setItem('sellOrderOpenMin',sellOrderOpenMin);
                sessionStorage.setItem('sellOrderOpenMax',sellOrderOpenMax);
                sessionStorage.setItem('sellOrderClose',sellOrderClose);
            }
            sessionStorage.setItem('currentCloseTime',candle.k.T);
            currentCloseTime = candle.k.T;
        }
    };

    socket.onclose = function(event) {
        console.log('socket state onclose '+socket.readyState);
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection died');
        }
        location.reload();
    };

    socket.onerror = function(error) {
        console.log('socket state onerror '+socket.readyState);
        console.log(`[error] ${error.message}`);
        location.reload();
    };
    
return socket;

}