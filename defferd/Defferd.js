function Defferd(io){
  this.io = io;
}

Defferd.prototype.on = function(channel){

  let timer_id;
  const _channel = this.io.of(channel);

  /* ticker socket channel */
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

  const GetTicker = require('../services/' + req.svc_id+ '.js');

  const getTicker = new GetTicker();

  getTicker.call(req, function(req_list){

      clientSocket.emit('services', {'res_list':req_list});
  });
};

module.exports = Defferd;
