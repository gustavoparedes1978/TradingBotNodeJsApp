var localCounter = 0;
var saludos = async function(localCounter){

	const myPromise = new Promise(function(resolve, reject) 
	{
		console.log(localCounter);
		localCounter++;
		localCounter = Number(localCounter);
		if(localCounter===5){console.log('5');resolve(true);}
		if(localCounter<5){saludos(localCounter);resolve(false);}
	});
	return await myPromise;

}

saludos(localCounter).then((res) => { console.log('ultimo mensaje '+res); });