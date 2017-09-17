
function AjaxSend(url){

  this.url = url;
  this.inputData = {};
}

AjaxSend.prototype.setInputData = function (data) {

  this.data = data;
};

AjaxSend.prototype.call = function (callback) {

  let that = this;

  /* Promise Job#1 ajax request */
  const _queryProfit = function(param){

    return new Promise(function(resolve, reject){

      $.ajax({
            url:that.url,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(that.data)
      })
      .done(function(data, textStatus, jqXHR) {
        resolve(data);
      })
      .fail(function(jqXHR, textStatus, errorThrown){
        reject(textStatus);
      })
      .always(function(data, textStatus, jqXHR){

      });
    });
  };

  _queryProfit().then(function(data){
    callback(data);
  })
  .catch(function(err){
    alert('에러발생' + err);
    callback(err);
  });
};
