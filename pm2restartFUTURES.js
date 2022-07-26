const pm2 = require('pm2')

pm2.connect(function(err) {
  
  if (err) {
    console.error(err)
    process.exit(2)
  }

  pm2.start({
    script    : 'mainBOTfutures.js',
    name      : 'mainBOTfutures'
  }, function(err, apps) {
    if (err) {
      console.error(err)
      return pm2.disconnect()
    }

    pm2.list((err, list) => {

		setInterval(function(){
			pm2.restart('mainBOTfutures', (err, proc) => {
				
			console.log('restarting mainBOTfutures...');
		  });
		},86400000);
      
    })
  })
})