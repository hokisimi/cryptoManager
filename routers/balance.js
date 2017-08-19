module.exports = function(io){

  var coinAPI = require('../api/coinApi')(io);

  /* 빗썸 api */
  var bithumb_api = new coinAPI('bithumb');
  bithumb_api.on('/ticker');  /* ticker채널 소켓 대기 */

  var route = require('express').Router();
  var conn = require('../config/db')();

  route.get('', function(req, res){

    if(req.user)
    {
      var sql = `SELECT exchng_id
                      , key_crnc_code
                      , crnc_code
                      , balance_amt
                   FROM balance
                  WHERE user_id = ?`;

      conn.query(sql, [req.user.id], function(err, rows, fields){

        var db_balance_infos = rows;

        if(err){
          console.log(err);
          res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
        }
        else{
          console.log('유저정보 : ', req.user);
          console.log('거래내역정보 : ', db_balance_infos);
          res.render('balance/view', {balance_infos:db_balance_infos, user:req.user});
        }

      });
    }
    else {
      res.render('auth/login');
    }
  });

  return route;
}
