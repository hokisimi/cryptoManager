module.exports = function(io){

  var config = require('../config/config.js');

  function CoinAPI(exchng_id){

  	this.exchng_id = exchng_id;
  }

  CoinAPI.prototype.on = function(channel){

    var _channel = io.of(channel);

    /* Bithumb ticker socket channel */
    _channel.on('connect', function(clientSocket){

      console.log('socket connected');

      clientSocket.on('getTicker', function(req){

        req_lists = req.req_lists;
        request_tot_cnt = req.req_lists.length;
        request_proc_cnt = 0;

        var Bithumb_api = require('./bithumb.js')(io);

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
                _channel.emit('getTicker', {'res_lists':req_lists});
            }
          });
        };
      });

      clientSocket.on('disconnect', function(){
        console.log('socket disconnect!');
      });
    });
  }

  return CoinAPI;
}
