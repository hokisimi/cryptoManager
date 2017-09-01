module.exports = function(io){

  function Defferd(){

  }

  Defferd.prototype.on = function(channel){

    var timer_id;
    var _channel = io.of(channel);

    /* Bithumb ticker socket channel */
    _channel.on('connect', function(clientSocket){

      clientSocket.on('services', function(req){

        emitClient(clientSocket, req);

        if(req.auto_resend)
        {
          timer_id = setInterval(emitClient, req.interval, clientSocket, req);
          console.log('timer start:' + timer_id);
        }
      });

      clientSocket.on('disconnect', function(){

        if(timer_id)
        {
            console.log('timer clear:' + timer_id);
            clearInterval(timer_id);
        }
        console.log('socket disconnect!');
      });
    });
  }

  function emitClient(clientSocket, req){

    var GetTicker = require('../services/' + req.svc_id+ '.js');

    var services = new GetTicker();

    services.call(req, function(req_lists){

        clientSocket.emit('services', {'res_lists':req_lists});
    });
  };

  return Defferd;
}
