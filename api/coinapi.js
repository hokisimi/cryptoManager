module.exports = function(io){

  var timer_id;

  function CoinAPI(exchng_id){

  	this.exchng_id = exchng_id;
  }

  CoinAPI.prototype.on = function(channel){

    var _channel = io.of(channel);

    /* Bithumb ticker socket channel */
    _channel.on('connect', function(clientSocket){

      clientSocket.on('services', function(req){

        emitClient(req, _channel);
        timer_id = setInterval(emitClient, 10000, req, _channel);
      });

      clientSocket.on('disconnect', function(){
        clearInterval(timer_id);
        console.log('socket disconnect!');
      });
    });
  }

  function emitClient(req, channel){

    var svc_id = req.svc_id;
    require('../services/' + svc_id + '.js')(req, function(req_lists){

      channel.emit('services', {'res_lists':req_lists});
    });
  }

  return CoinAPI;
}
