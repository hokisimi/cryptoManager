module.exports = function(io){

  var config = require('../config/config.js');
  var startPoint;
  var endPoint;

  function CoinAPI(exchng_id){

  	this.exchng_id = exchng_id;
  }

  CoinAPI.prototype.setStartPoint = function(in_startPoint) {

    startPoint = in_startPoint;
  }

  CoinAPI.prototype.setEndPoint = function(in_endPoint) {

    endPoint = in_endPoint;
  }

  CoinAPI.prototype.on = function(params) {

    if(this.exchng_id == 'bithumb'){

      var request_tot_cnt = 0;
      var request_proc_cnt = 0;
      var req_lists;

      console.log('on메서드 호출');

      var bal_ticker = io.of(startPoint);

      /* Bithumb ticker socket channel */
      bal_ticker.on('connect', function(clientSocket){

        clientSocket.on(startPoint, function(req){

          req_lists = req.req_lists;
          request_tot_cnt = req.req_lists.length;
          request_proc_cnt = 0;

          var Bithumb_api = require('./bithumb.js')(io);

          var bithumb_api = new Bithumb_api(config.get('api.bithumb.connect_key'), config.get('api.bithumb.secret_key'));

          for(var i = 0; i < req_lists.length; i++){

              console.log(req_lists[i].crnc_code);

              bithumb_api.xcoinApiCall(endPoint + '/' + req_lists[i].crnc_code, {}, req_lists[i].crnc_code, function(id, res_data){

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
                    bal_ticker.emit('XCoinAPIResponse', {'res_lists':req_lists});
                }
              });
          };
        });

        clientSocket.on('disconnect', function(){
          console.log('socket disconnect!');
        });
      });

    }
    else if(this.exchng_id == 'coinone'){

    }
  };

  return CoinAPI;
}
