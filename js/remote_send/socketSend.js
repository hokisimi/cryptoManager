
function SocketSend(svc_id, channel, auto_resend, interval){

  this.svc_id = svc_id;
  this._channel = channel;
  this.auto_resend = auto_resend;
  this.interval = interval;
}

SocketSend.prototype.setReqList = function (req_list) {

  this._req_list = req_list;
};

SocketSend.prototype.call = function (callback) {

  if(this._req_list)
  {
    this._channel.emit('services', {'svc_id':this.svc_id, 'auto_resend':this.auto_resend, 'interval':this.interval, 'req_list':this._req_list});
  }

  this._channel.on('services', function(rsData){

    callback(rsData.res_list);
  });
};
