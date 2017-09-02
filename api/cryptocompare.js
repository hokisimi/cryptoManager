const request = require('request');

function CryptoCompare(){
	this.apiUrl = 'https://min-api.cryptocompare.com';
}


// fsym=BTC&tsyms=KRW&e=Coinone

CryptoCompare.prototype.ApiCall = function(endPoint, params, id, callback) {
	let rgParams = {};

	if(params) {
		for(o in params){
			rgParams[o] = params[o];
		}
	}

	const api_host = this.apiUrl + endPoint;
	const rgResult = this.request('GET', api_host, rgParams, id, callback);
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

    const rgResultDecode = JSON.parse(rgResult);

    if(typeof callback === 'function') {
        console.log('콜백호출');
				console.log(rgResultDecode);
        callback(id, rgResultDecode);
    }
	});
}

module.exports = CryptoCompare;
