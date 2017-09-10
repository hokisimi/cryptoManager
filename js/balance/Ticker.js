
function Ticker(channel){

  this._channel = channel;
  this._req_list = [];
}

Ticker.prototype.setReqList = function (req_list) {

  this._req_list = req_list;
};

Ticker.prototype.getTicker = function (callback) {


  if(this._req_list)
  {
    this._channel.emit('services', {'svc_id':'getTicker', 'auto_resend':1, 'interval':10*1000, 'req_list':this._req_list});
  }

  this._channel.on('services', function(rsData){

    callback(rsData.res_list);
  });
};
