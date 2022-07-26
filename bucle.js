var excludedSignals = ['GALAUSDT','WAVESUSDT','APEUSDT','GMTUSDT','LUNAUSDT','SOLUSDT','DARUSDT','ENSUSDT','1000SHIBUSDT','SHIBUSDT','BTCBUSD','EGLDUSDT','HNTUSDT','SOLBUSD','ADABUSD','AVAXUSDT','KNCUSDT'];
var sortedVolumes = [{"symbol":"BTCUSDT","volume":"423242.750","lastPrice":"39717.70"},{"symbol":"ETHUSDT","volume":"1729935.356","lastPrice":"2945.72"},{"symbol":"ZILUSDT","volume":"23108522922","lastPrice":"0.09089"},{"symbol":"TRXUSDT","volume":"19981372913","lastPrice":"0.08828"},{"symbol":"NEARUSDT","volume":"73372007","lastPrice":"13.0080"},{"symbol":"ADAUSDT","volume":"1022939560","lastPrice":"0.89800"},{"symbol":"FTMUSDT","volume":"726903556","lastPrice":"0.867800"},{"symbol":"CRVUSDT","volume":"230138018.2","lastPrice":"2.614"},{"symbol":"GALAUSDT","volume":"3009450235","lastPrice":"0.16067"},{"symbol":"XRPUSDT","volume":"718634843.0","lastPrice":"0.6526"}]

var index4;
for(index4=0;index4<excludedSignals.length;index4++)
{
	var index5;
	for(index5=0;index5<sortedVolumes.length;index5++)
		{
			var localSignal = String(sortedVolumes[index5].symbol);
			var currentSignal = String(excludedSignals[index4]);
			if(localSignal===currentSignal)
			{
				sortedVolumes.splice(index5,1);
			}
		}
}
console.log(sortedVolumes);