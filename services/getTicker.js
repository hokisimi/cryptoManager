
function GetTicker(){

}

GetTicker.prototype.call = function(req, callback){

  var req_lists = req.req_lists;
  var request_tot_cnt = req.req_lists.length;
  var request_proc_cnt = 0;

  var CryptoCompareApi = require('../api/cryptocompare.js');
  var cryptoCompareApi = new CryptoCompareApi();

  for(var i = 0; i < request_tot_cnt; i++){

    console.log(req_lists[i].exchng_id, req_lists[i].key_crnc_code, req_lists[i].crnc_code);

    // Format Example: fsym=BTC&tsyms=KRW&e=Coinone
    var params = {
      fsym : req_lists[i].crnc_code,
      tsyms: req_lists[i].key_crnc_code,
      e : req_lists[i].exchng_id
    }

    cryptoCompareApi.ApiCall('/data/price', params, req_lists[i].crnc_code, function(id, res_data){

      for(var j = 0; j < request_tot_cnt; j++){

        if(req_lists[j].crnc_code == id)
        {
            var close_price = Number(res_data[req_lists[j].key_crnc_code]).toFixed(8);
            req_lists[j]['close_price'] = close_price;
        }
      }

      request_proc_cnt += 1;

      if(request_tot_cnt == request_proc_cnt)
      {
          console.log(req_lists);
          callback(req_lists);
      }
    });
  };
}

module.exports = GetTicker;
