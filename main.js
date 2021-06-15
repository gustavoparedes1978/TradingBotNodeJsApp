/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var http = require("http");
var url = require("url");
var fs = require("fs");
 
http.createServer(function (req, res) {
        var q = url.parse(req.url, true);
        //console.log(q.pathname);
        var filename = q.pathname;
        var template = "";
        var mimeType = "";

        switch(filename) {
            case "/":
                template = "./public/index.html";
                mimeType = "text/html";
                break;
            case "/css/style.css":
                template = "./public/css/style.css";
                mimeType = "text/css";
                break;
            case "/js/kagi.js":
                template = "./public/js/kagi.js";
                mimeType = "application/javascript";
                break;
            case "/js/data.js":
                template = "./public/js/data.js";
                mimeType = "application/javascript";
                break;
            case "/js/main.js":
                template = "./public/js/main.js";
                mimeType = "application/javascript";
                break;
            case "/js/HistoricalData.js":
                template = "./public/js/HistoricalData.js";
                mimeType = "application/javascript";
                break;
            case "/js/WebSocket.js":
                template = "./public/js/WebSocket.js";
                mimeType = "application/javascript";
                break;
        }
    
        fs.readFile(template, function(err, data) 
        {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            else
            {
                res.writeHead(200, {'Content-Type': mimeType});
                res.write(data);
                return res.end();
            }
        });
    
    }).listen(process.env.PORT || 5000);




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

var lowestATR = 0;

var buyOpenOrderFractionBoolean = true;
var buyCloseOrderFractionBoolean = false;

var lowestATRFractionBuyTwo = 0;
var lowestATRFractionBuyTwoMin = 0;
var lowestATRFractionSellTwo = 0;
var lowestATRFractionSellTwoMin = 0;

var sellOpenOrderFractionBoolean = true;
var sellCloseOrderFractionBoolean = false;

var currentCloseTime = 0;
var readyForTradingFraction = false;

var buyingAttempts = 0;
var limitNumberBuyingOrders = 0;
var lowestBuyingAttempts = 0;
var buyOrders = [];

var sellingAttempts = 0;
var limitNumberSellingOrders = 0;
var lowestSellingAttempts = 0;
var sellOrders = [];

var interval = "30m";
var symbol = "BTCUSDT";
var symbolStream = "btcusdt";
var stream = "@kline_"+interval;
var streamName = symbolStream+stream;

var balance = 20000;
var lastClosingPrice = 0;
var counter = 0;

var W3CWebSocket = require('websocket').w3cwebsocket;

var socket = new W3CWebSocket("wss://stream.binance.com:9443/ws/"+streamName);
//let socket = new WebSocket("wss://stream.binance.com:9443/ws/"+streamName);
startWebSocket(socket,streamName);

function loadDataWebSocket()
{
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttpRequest = new XMLHttpRequest();
    xhttpRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {

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
            lowestATR = ATR_SMAs_Array[0];
            var date = new Date();
            console.log('ATR_SMAs_Array '+ATR_SMAs_Array[0]+' '+date);


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

            }*/
        }
  };
  
    xhttpRequest.open("GET", "https://api.binance.com/api/v3/klines?symbol="+symbol+"&interval="+interval+"&limit=1000", true);
    xhttpRequest.send();
}



function startWebSocket(socket,streamName)
{
    socket.onopen = function(event) 
    {
        var date = new Date();
        console.log('socket state onopen '+socket.readyState+' '+date);
        var message = "{\"method\": \"SUBSCRIBE\",\"params\": [\""+streamName+"\"],\"id\": \"1\" }";
        if(socket.readyState===0){socket.send(message);}
        console.log('lowestATR '+lowestATR);  
    };

     /*
  * {"e":"kline","E":1616193759978,"s":"BTCUSDT","k":{"t":1616112000000,"T":1616198399999,"s":"BTCUSDT","i":"1d","f":715419259,"L":717238861,"o":"57641.00000000","c":"58402.74000000","h":"59468.00000000","l":"56270.74000000","v":"50460.12843600","n":1819603,"x":false,"q":"2940181959.97141612","V":"24618.24808700","Q":"1434862931.36678269","B":"0"}}
  */
    socket.onmessage = function(event) 
    {
        var date = new Date();
        var candle = JSON.parse(event.data);
        var currentDate = parseInt(new Date().getTime()); //get current time in milliseconds
        var closingPrice = parseFloat(candle.k.c);
        
        if(closingPrice>lastClosingPrice){
            buyingAttempts++;lastClosingPrice=closingPrice;
            if(buyingAttempts<lowestSellingAttempts){lowestSellingAttempts = sellingAttempts;}
        }
        
        if(closingPrice<lastClosingPrice){
            sellingAttempts++;lastClosingPrice=closingPrice;
            if(sellingAttempts<lowestBuyingAttempts){lowestBuyingAttempts = buyingAttempts;}
        }
        
        counter++;
        
        var lowestATRFractionMin = lowestATR*0.1;
        var lowestATRFractionMax = lowestATR*0.3;
        
        var low = parseFloat(candle.k.l); //calculating lowest of time period
        var closingPriceMinusLow = Math.abs(closingPrice - low);
        
        var high = parseFloat(candle.k.h); //calculating highest of time period
        var closingPriceMinusHigh = Math.abs(closingPrice - high);
        
        const buyingSellingLimit = 50;
        
        var diffBuyingAttempts = buyingAttempts-lowestBuyingAttempts;
        var diffSellingAttempts = sellingAttempts-lowestSellingAttempts;
        var date = new Date();
        if((closingPriceMinusHigh>=lowestATRFractionMin&&closingPriceMinusHigh<=lowestATRFractionMax)&&readyForTradingFraction)
        {
            prom = (high-low)/10;
            lowestATRhalf = lowestATR/10;
            if(prom>=lowestATRhalf&&counter>=buyingSellingLimit&&diffBuyingAttempts>diffSellingAttempts&&sellOpenOrderFractionBoolean&&limitNumberSellingOrders<2) 
            {
                console.log("sell order open on buy "+closingPrice+" "+date);
                console.log("diffBuyingAttempts "+diffBuyingAttempts+" diffSellingAttempts "+diffSellingAttempts);
                console.log("high "+high);
                lowestATRFractionBuyTwo = closingPrice - lowestATR*0.15;
                console.log("closePrice "+lowestATRFractionBuyTwo);
                buyOpenOrderFractionBoolean = false; buyCloseOrderFractionBoolean = false;
                sellOpenOrderFractionBoolean = false; sellCloseOrderFractionBoolean = true;
                sellOrders.push({"openPrice":closingPrice,"closePrice":lowestATRFractionBuyTwo});
                limitNumberSellingOrders++;
            }
        }
        if(closingPriceMinusLow>=lowestATRFractionMin&&closingPriceMinusLow<=lowestATRFractionMax&&readyForTradingFraction&&sellOpenOrderFractionBoolean)
        {
            prom = (high-low)/10;
            lowestATRhalf = lowestATR/10;
            if(prom>=lowestATRhalf&&counter>=buyingSellingLimit&&diffBuyingAttempts<diffSellingAttempts&&buyOpenOrderFractionBoolean&&limitNumberBuyingOrders<2)
            {
                console.log("buy order open on sell "+closingPrice+" "+date);
                console.log("diffBuyingAttempts "+diffBuyingAttempts+" diffSellingAttempts "+diffSellingAttempts);
                console.log("low "+low);
                lowestATRFractionSellTwo = closingPrice + lowestATR*0.15;
                console.log("closePrice "+lowestATRFractionSellTwo);
                buyOpenOrderFractionBoolean = false; buyCloseOrderFractionBoolean = true;
                sellOpenOrderFractionBoolean = false; sellCloseOrderFractionBoolean = false;
                buyOrders.push({"openPrice":closingPrice,"closePrice":lowestATRFractionSellTwo});
                limitNumberBuyingOrders++;
            }
        }
        if(limitNumberSellingOrders===2){limitNumberBuyingOrders=0;limitNumberSellingOrders++;}
        if(limitNumberBuyingOrders===2){limitNumberSellingOrders=0;limitNumberBuyingOrders++;}
        buyOrders.forEach(function(item,index){
            var localOpenPrice = item.openPrice;
            var localClosePrice = item.closePrice;
            if((closingPrice>=localClosePrice)&&readyForTradingFraction&&buyCloseOrderFractionBoolean)
            {
                sellOpenOrderFractionBoolean = true; sellCloseOrderFractionBoolean = false;
                buyOpenOrderFractionBoolean = true; buyCloseOrderFractionBoolean = false;
                console.log("buy order close "+closingPrice+" "+date);
                console.log("diffBuyingAttempts "+diffBuyingAttempts+" diffSellingAttempts "+diffSellingAttempts);
                buyOrders.splice(index,1);
                balance = balance*10*(1 - (localOpenPrice / closingPrice) - 0.00075) + balance;
                console.log('Balance '+balance);
                counter = 0; sellingAttempts = 0; buyingAttempts = 0; lowestBuyingAttempts = 0; lowestSellingAttempts = 0;
            }
        });
        sellOrders.forEach(function(item,index){ 
            var localOpenPrice = item.openPrice;
            var localClosePrice = item.closePrice;
            if((closingPrice<=localClosePrice)&&readyForTradingFraction&&sellCloseOrderFractionBoolean)
            {
                sellOpenOrderFractionBoolean = true; sellCloseOrderFractionBoolean = false;
                buyOpenOrderFractionBoolean = true; buyCloseOrderFractionBoolean = false;
                console.log("sell order close "+closingPrice+" "+date);
                console.log("diffBuyingAttempts "+diffBuyingAttempts+" diffSellingAttempts "+diffSellingAttempts);
                sellOrders.splice(index,1); 
                balance = balance*10*((localOpenPrice / closingPrice)-1-0.00075) + balance;
                console.log('Balance '+balance);
                counter = 0; sellingAttempts = 0; buyingAttempts = 0; lowestBuyingAttempts = 0; lowestSellingAttempts = 0;
            }
        });
        if(currentDate>currentCloseTime)
        {
            if(currentCloseTime!==0){readyForTradingFraction = true;}
            currentCloseTime = candle.k.T;
            loadDataWebSocket();
            lastClosingPrice = parseFloat(candle.k.c);
            counter = 0; sellingAttempts = 0; buyingAttempts = 0; lowestBuyingAttempts = 0; lowestSellingAttempts = 0;
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
        socket = new W3CWebSocket("wss://stream.binance.com:9443/ws/"+streamName);
        startWebSocket(socket,streamName);
    };

    socket.onerror = function(error) {
        var date = new Date();
        console.log('socket state onerror '+socket.readyState+' '+date);
        console.log(`[error] ${error.message}`);
        socket = new W3CWebSocket("wss://stream.binance.com:9443/ws/"+streamName);
        startWebSocket(socket,streamName);
    };

}

 const ping = require('node-http-ping');
 
 function pingFunction(){
 ping('https://radiant-headland-62259.herokuapp.com')
  .then(time => console.log(`Response time: ${time} ms`))
  .catch(() => console.log('Failed to ping'));
 }
 
pingFunction();
setInterval(pingFunction,6e+5);