module.exports = function(io){

  const route = require('express').Router();
  const conn = require('../config/db')();
  const Defferd = require('../defferd/Defferd')

  const defferd = new Defferd(io);
  defferd.on('/top2currency_ticker');
  defferd.on('/balance_ticker');

  route.get('', function(req, res){

    if(req.user)
    {
      const sql = `SELECT exchng_id
                        , key_crnc_code
                        , crnc_code
                        , balance_amt
                     FROM balance
                    WHERE user_id = ?`;

      conn.query(sql, [req.user.id], function(err, rows, fields){

        const db_balance_infos = rows;

        if(err){
          console.log(err);
          res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
        }
        else{
          console.log('유저정보 : ', req.user);
          console.log('잔고정보 : ', db_balance_infos);
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
