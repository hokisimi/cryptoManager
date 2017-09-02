var request = require('request');

function CryptoCompare(){
	this.apiUrl = 'https://min-api.cryptocompare.com';
}


// fsym=BTC&tsyms=KRW&e=Coinone

CryptoCompare.prototype.ApiCall = function(endPoint, params, id, callback) {
	var rgParams = {};

	if(params) {
		for(o in params){
			rgParams[o] = params[o];
		}
	}

	var api_host = this.apiUrl + endPoint;
	var rgResult = this.request('GET', api_host, rgParams, id, callback);
}

CryptoCompare.prototype.request = function(strMethod, strHost, rgParams, id, callback) {

	console.log("request call");
	request({
		method : strMethod,
		uri : strHost,
		qs : rgParams
	},
	function(error, response, rgResult) {
		if(error) {
			console.log(error);
		}

    var rgResultDecode = JSON.parse(rgResult);

    if(typeof callback === 'function') {
        console.log('콜백호출');
				console.log(rgResultDecode);
        callback(id, rgResultDecode);
    }
	});
}

module.exports = CryptoCompare;
