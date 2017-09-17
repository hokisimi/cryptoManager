function Defferd(io){
  this.io = io;
}

Defferd.prototype.on = function(channel){

  const _channel = this.io.of(channel);

  /* ticker socket channel */
  _channel.on('connect', function(clientSocket){

    clientSocket.on('services', function(req){

      emitClient(clientSocket, req);

      if(req.auto_resend == 'Y')
      {
        clientSocket.timer_id = setInterval(emitClient, req.interval, clientSocket, req);
        console.log('timer start:' + clientSocket.timer_id);
      }
    });

    clientSocket.on('disconnect', function(){

      if(clientSocket.timer_id)
      {
          console.log('timer clear:' + clientSocket.timer_id);
          clearInterval(clientSocket.timer_id);
      }
      console.log('socket disconnect!');
    });
  });
}

function emitClient(clientSocket, req){

  const GetTicker = require('../services/socket/' + req.svc_id+ '.js');

  const getTicker = new GetTicker();

  getTicker.call(req, function(req_list){

      clientSocket.emit('services', {'res_list':req_list});
  });
};

module.exports = Defferd;
