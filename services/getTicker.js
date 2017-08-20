module.exports = function(req, callback){

  var Bithumb_api = require('../api/bithumb.js');

  var req_lists = req.req_lists;
  var request_tot_cnt = req.req_lists.length;
  var request_proc_cnt = 0;

  var bithumb_api = new Bithumb_api('','');

  for(var i = 0; i < req_lists.length; i++){

    console.log(req_lists[i].crnc_code);

    bithumb_api.xcoinApiCall('/public/ticker' + '/' + req_lists[i].crnc_code, {}, req_lists[i].crnc_code, function(id, res_data){

      console.log('콜백실행');

      for(var j = 0; j < req_lists.length; j++){
        if(req_lists[j].crnc_code == id)
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