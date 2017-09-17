
function GetTicker(){

}

GetTicker.prototype.call = function(req, callback){

  var req_list = req.req_list;
  var request_tot_cnt = req.req_list.length;
  var request_proc_cnt = 0;

  var CryptoCompareApi = require('../../api/cryptocompare.js');
  var cryptoCompareApi = new CryptoCompareApi();

  for(var i = 0; i < request_tot_cnt; i++){

    console.log(req_list[i].exchng_id, req_list[i].key_crnc_code, req_list[i].crnc_code);

    // Format Example: fsym=BTC&tsyms=KRW&e=Coinone
    var params = {
      fsym : req_list[i].crnc_code,
      tsyms: req_list[i].key_crnc_code,
      e : req_list[i].exchng_id
    }

    cryptoCompareApi.ApiCall('/data/price', params, req_list[i].crnc_code, function(id, res_data){

      for(var j = 0; j < request_tot_cnt; j++){

        if(req_list[j].crnc_code == id)
        {
            var close_price = Number(res_data[req_list[j].key_crnc_code]).toFixed(8);
            req_list[j]['close_price'] = close_price;
        }
      }

      request_proc_cnt += 1;

      if(request_tot_cnt == request_proc_cnt)
      {
          console.log(req_list);
          callback(req_list);
      }
    });
  };
}

module.exports = GetTicker;
