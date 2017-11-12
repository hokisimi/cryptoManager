
const conn = require('../../config/db')();

function GetProfit(inputData){

  this.inputData = inputData;

}

GetProfit.prototype.call = function(callback){

  let that = this;

  let db_btc_sellSumAmt;
  let db_eth_sellSumAmt;
  let db_btc_buySumAmt;
  let db_eth_buySumAmt;

  const _querySumSellAmt = function(param){

    return new Promise(function(resolve, reject){

      const sql = `SELECT COALESCE(SUM(IF(key_crnc_code = 'BTC', deal_amt, 0)), 0) btc_sumSellAmt
                        , COALESCE(SUM(IF(key_crnc_code = 'ETH', deal_amt, 0)), 0) eth_sumSellAmt
                     FROM trade_info
                    WHERE user_id = ?
                      AND key_crnc_code IN('BTC', 'ETH')
                      AND deal_tp = '2'`;

      conn.query(sql, [that.inputData.user.id], function(err, rows, fields){

        console.log('매도금액:', rows);
        db_btc_sellSumAmt = rows[0].btc_sumSellAmt;
        db_eth_sellSumAmt = rows[0].eth_sumSellAmt;

        if(err){
          reject(err);
        }
        else{
          resolve();
        }
      });
    });
  };

  const _querySumBuyAmt = function(param){

    return new Promise(function(resolve, reject){

      const sql = `SELECT COALESCE(SUM(IF(key_crnc_code ='BTC', deal_amt, 0)), 0) btc_sumBuyAmt
                        , COALESCE(SUM(IF(key_crnc_code ='ETH', deal_amt, 0)), 0) eth_sumBuyAmt
                     FROM trade_info
                    WHERE user_id = ?
                      AND key_crnc_code IN ('BTC', 'ETH')
                      AND deal_tp = '1'`;

      conn.query(sql, [that.inputData.user.id], function(err, rows, fields){

        console.log('매수금액:', rows);
        db_btc_buySumAmt = rows[0].btc_sumBuyAmt;
        db_eth_buySumAmt = rows[0].eth_sumBuyAmt;

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
    callback({'btc_sumSellAmt':db_btc_sellSumAmt, 'btc_sumBuyAmt':db_btc_buySumAmt, 'eth_sumSellAmt':db_eth_sellSumAmt, 'eth_sumBuyAmt':db_eth_buySumAmt});
  })
  .catch(function(err){
    console.log('데이터 가공실패');
    callback(err);
  });
}

module.exports = GetProfit;
