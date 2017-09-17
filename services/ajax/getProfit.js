
const conn = require('../../config/db')();

function GetProfit(inputData){

  this.inputData = inputData;

}

GetProfit.prototype.call = function(callback){

  let that = this;

  let db_sellSumAmt;
  let db_buySumAmt;

  const _querySumSellAmt = function(param){

    return new Promise(function(resolve, reject){

      const sql = `SELECT COALESCE(SUM(deal_amt), 0) sumSellAmt
                     FROM trade_info
                    WHERE user_id = ?
                      AND key_crnc_code = 'BTC'
                      AND deal_tp = '2'`;

      conn.query(sql, [that.inputData.user.id], function(err, rows, fields){

        console.log('매도금액:', rows);
        db_sellSumAmt = rows[0].sumSellAmt;

        if(err){
          reject(err);
        }
        else{
          resolve(db_sellSumAmt);
        }
      });
    });
  };

  const _querySumBuyAmt = function(param){

    return new Promise(function(resolve, reject){

      const sql = `SELECT COALESCE(SUM(deal_amt), 0) sumBuyAmt
                     FROM trade_info
                    WHERE user_id = ?
                      AND key_crnc_code = 'BTC'
                      AND deal_tp = '1'`;

      conn.query(sql, [that.inputData.user.id], function(err, rows, fields){

        console.log('매수금액:', rows);
        db_buySumAmt = rows[0].sumBuyAmt;

        if(err){
          reject(err)
        }
        else{
          resolve();
        }
      });
    });
  };

  _querySumSellAmt().then(function(){
    return _querySumBuyAmt();
  })
  .then(function(){
    console.log('데이터 가공성공');
    callback({'sumSellAmt':db_sellSumAmt, 'sumBuyAmt':db_buySumAmt});
  })
  .catch(function(err){
    console.log('데이터 가공실패');
    callback(err);
  });
}

module.exports = GetProfit;
