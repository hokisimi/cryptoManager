
function GetTicker(){

}

GetTicker.prototype.call = function(req, callback){

  var CryptoCompareApi = require('../api/cryptocompare.js');

  var req_lists = req.req_lists;
  var request_tot_cnt = req.req_lists.length;
  var request_proc_cnt = 0;

  var cryptoCompareApi = new CryptoCompareApi();

  for(var i = 0; i < request_tot_cnt; i++){

    console.log(req_lists[i].exchng_id, req_lists[i].key_crnc_code, req_lists[i].crnc_code);

    cryptoCompareApi.ApiCall('/data/price/', req_lists[i], function(id, res_data){

      for(var j = 0; j < request_tot_cnt; j++){

        var private_key = req_lists[i].exchng_id + req_lists[i].key_crnc_code + req_lists[i].crnc_code;

        if(private_key == id)
        {
            req_lists[j]['res_data'] = res_data;
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
