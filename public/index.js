var http = require("http");
var url = require("url");
var fs = require("fs");


http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    console.log(q.pathname);
    var filename = q.pathname;
    var template = "";
    var mimeType = "";
    
    switch(filename) {
        case "/":
            template = "./index.html";
            mimeType = "text/html";
            break;
        case "/css/style.css":
            template = "./css/style.css";
            mimeType = "text/css";
            break;
        case "/js/kagi.js":
            template = "./js/kagi.js";
            mimeType = "application/javascript";
            break;
        case "/js/data.js":
            template = "./js/data.js";
            mimeType = "application/javascript";
            break;
        case "/js/main.js":
            template = "./js/main.js";
            mimeType = "application/javascript";
            break;
        case "/js/HistoricalData.js":
            template = "./js/HistoricalData.js";
            mimeType = "application/javascript";
            break;
        case "/js/WebSocket.js":
            template = "./js/WebSocket.js";
            mimeType = "application/javascript";
            break;
    }
    
    console.log(template);
    fs.readFile(template, function(err, data) {
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
    
}).listen(8080);

console.log('reading code');
var interval = localStorage.getItem('interval');
var symbol = localStorage.getItem('symbol');
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

function startWebSocket(socket,streamName)
{
    if(localStorage.getItem('buyOrderOpenMin')!==null){buyOrderOpenMin=parseFloat(localStorage.getItem('buyOrderOpenMin'));}
    if(localStorage.getItem('buyOrderClose')!==null){buyOrderClose=parseFloat(localStorage.getItem('buyOrderClose'));}
    if(localStorage.getItem('counterbuy')!==null){counterbuy=parseInt(localStorage.getItem('counterbuy'));}
    if(localStorage.getItem('buyCloseOrderBoolean')!==null){buyCloseOrderBoolean=eval(localStorage.getItem('buyCloseOrderBoolean'));}

    if(localStorage.getItem('sellOrderOpenMin')!==null){sellOrderOpenMin=parseFloat(localStorage.getItem('sellOrderOpenMin'));}
    if(localStorage.getItem('sellOrderClose')!==null){sellOrderClose=parseFloat(localStorage.getItem('sellOrderClose'));}
    if(localStorage.getItem('countersell')!==null){countersell=parseInt(localStorage.getItem('countersell'));}
    if(localStorage.getItem('sellCloseOrderBoolean')!==null){sellCloseOrderBooelan=eval(localStorage.getItem('sellCloseOrderBoolean'));}

    if(localStorage.getItem('currentCloseTime')!==null){currentCloseTime=parseFloat(localStorage.getItem('currentCloseTime'));}
    if(localStorage.getItem('readyForTrading')!==null){readyForTrading=eval(localStorage.getItem('readyForTrading'));}
    
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
            localStorage.setItem('buyOpenOrderBoolean','false');
            localStorage.setItem('buyCloseOrderBoolean','true');
            localStorage.setItem('counterbuy',counterbuy);
        }
        if(closingPrice>=buyOrderClose&&buyOrderClose!==0&&buyCloseOrderBoolean)
        {
            console.log("buy order close "+closingPrice+" "+date);
            buyOpenOrderBoolean = true; buyCloseOrderBoolean = false;
            localStorage.setItem('buyOpenOrderBoolean','true');
            localStorage.setItem('buyCloseOrderBoolean','false');
        }
        
        if(closingPrice<=sellOrderOpenMin&&sellOrderOpenMin!==0&&sellOpenOrderBoolean&&countersell===0)
        {
            countersell++;
            localStorage.setItem('countersell',countersell);
            console.log("sell order open "+closingPrice+" "+date);
            sellOpenOrderBoolean = false; sellCloseOrderBoolean = true;
            localStorage.setItem('sellOpenOrderBoolean','false');
            localStorage.setItem('sellCloseOrderBoolean','true');
            
        }
        if(closingPrice<=sellOrderClose&&sellOrderClose!==0&&sellCloseOrderBoolean)
        {
            console.log("sell order close "+closingPrice+" "+date);
            sellOpenOrderBoolean = true; sellCloseOrderBoolean = false;
            localStorage.setItem('sellOpenOrderBoolean','true');
            localStorage.setItem('sellCloseOrderBoolean','false');
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
    
return socket;

}






