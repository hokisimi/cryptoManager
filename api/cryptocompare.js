var request = require('request');

function CryptoCompare(){
	this.apiUrl = 'https://min-api.cryptocompare.com';
}

CryptoCompare.prototype.ApiCall = function(endPoint, params, id, callback) {
	var rgParams = {
		'endPoint' : endPoint
	};

	if(params) {
		for(o in params){
			rgParams[o] = params[o];
		}
	}

	var api_host = this.apiUrl + endPoint;
	var rgResult = this.request('GET', api_host, rgParams, id, callback);
}

CryptoCompare.prototype.request = function(strMethod, strHost, rgParams, id, callback) {

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
        callback(id, rgResultDecode);
    }
	});
}

function http_build_query(obj) {
	var output_string = []
	Object.keys(obj).forEach(function (val) {
		var key = val;
		key = encodeURIComponent(key.replace(/[!'()*]/g, escape));

		if (typeof obj[val] === 'object') {
			var query = build_query(obj[val], null, key)
			output_string.push(query)
		}
		else {
			var value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
			output_string.push(key + '=' + value)
		}
	})

	return output_string.join('&');
}

module.exports = XCoinAPI;
