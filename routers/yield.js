module.exports = function(){

  var route = require('express').Router();
  var conn = require('../config/db')();

  route.get('', function(req, res){

    var _queryDealInfo = function(param){

      return new Promise(function(resolve, reject){

        var sql = `SELECT exchng_id
                        , DATE_FORMAT(deal_dt, '%Y%m%d') deal_dt
                        , deal_no
                        , deal_tp
                        , crnc_code
                        , key_crnc_code
                        , qry
                        , unit_prc
                        , deal_amt
                        , cmsn_amt
                     FROM trade_info
                    WHERE user_id = ?`;

        conn.query(sql, [req.user.id], function(err, rows, fields){

          var db_trade_info = rows;

          if(err){
            reject(err)
          }
          else{
            resolve(db_trade_info);
          }
        });
      });
    };

    if(req.user)
    {
      _queryDealInfo().then(function(db_trade_info){
        console.log('유저정보 : ', req.user);
        console.log('거래내역정보 : ', db_trade_info);
        res.render('yield/view', {trade_infos:db_trade_info, user:req.user});
      }).catch(function(err){
        console.log(err);
        res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
      });
    }
    else {
      res.render('auth/login');
    }
  });

  route.get('/add', function(req, res) {

    res.render('yield/add', {user:req.user});
  });

  route.post('/add', function(req, res){

    var in_deal_dt        = req.body.deal_dt;
    var in_deal_no        = 0;
    var in_id             = req.user.id;
    var in_exchng_id      = req.body.exchng_id;
    var in_deal_tp        = req.body.deal_tp;
    var in_crnc_code      = req.body.crnc_code;
    var in_key_crnc_code  = req.body.key_crnc_code;
    var in_qry            = req.body.qry;
    var in_unit_prc       = req.body.unit_prc;
    var in_deal_amt       = req.body.deal_amt;
    var in_cmsn_amt       = req.body.cmsn_amt;

    var _makeSeq = function(param){

      return new Promise(function(resolve, reject){

        console.log('add', req.body);
        console.log('add', req.user);

        var sql = `SELECT COALESCE(MAX(deal_no), 0) + 1 deal_no
                     FROM trade_info
                    WHERE deal_dt = ?
                      AND user_id = ?`;

        conn.query(sql, [req.body.deal_dt, req.user.id], function(err, rows, fields){

          if(err){
            reject(err);
          }
          else{
            in_deal_no = rows[0].deal_no
            resolve();
          }
        });
      });
    };

    var _insertTradeinfo = function(){

      return new Promise(function(resolve, reject){

        console.log('add', req.body);
        console.log('add', req.user);

        var params = [in_deal_dt, in_deal_no, in_id, in_exchng_id ,in_deal_tp, in_crnc_code, in_key_crnc_code, in_qry, in_unit_prc, in_deal_amt, in_cmsn_amt];

        var sql = `INSERT INTO trade_info(
                    deal_dt,
                    deal_no,
                    user_id,
                    exchng_id,
                    deal_tp,
                    crnc_code,
                    key_crnc_code,
                    qry,
                    unit_prc,
                    deal_amt,
                    cmsn_amt)
                   VALUES(?, ?, ?, ?, ?, ?, ?, ? ,? ,?, ?)`;

        conn.query(sql, params, function(err, rows, fields){

          if(err){
            console.log(err);
            reject(err);
          }
          else{
            resolve();
          }
        });
      });
    };

    var _qryBalanceInfo = function(){

      return new Promise(function(resolve, reject){

        var sql = `SELECT *
                     FROM balance
                    WHERE exchng_id = ?
                      AND crnc_code = ?
                      AND user_id   = ?`;

        conn.query(sql, [in_exchng_id, in_crnc_code, in_id], function(err, rows, fields){

          if(err){
            console.log(err);
            reject(err);
          }
          else{
            var balance_info = rows[0];
            resolve(balance_info);
          }
        });
      });
    };

    var _insertOrUdateBalanceInfo = function(balance_info){

      return new Promise(function(resolve, reject){

        if(balance_info){

          if(in_deal_tp == '2')
          {
            in_qry = (-1)*in_qry;
          }

          var sql = `UPDATE balance
                        SET balance_amt = balance_amt + ?
                      WHERE exchng_id = ?
                        AND crnc_code = ?
                        AND user_id   = ?`;

          conn.query(sql, [in_qry, in_exchng_id, in_crnc_code, in_id], function(err, rows, fields){

            if(err){
              console.log(err);
              reject(err);
            }
            else{
              resolve();
            }
          });
        }
        else {
          var sql = `INSERT INTO balance(
                      exchng_id,
                      key_crnc_code,
                      crnc_code,
                      user_id,
                      balance_amt)
                     VALUES(?, ?, ?, ?, ?)`;

          conn.query(sql, [in_exchng_id, in_key_crnc_code, in_crnc_code, in_id, in_qry], function(err, rows, fields){

            if(err){
              console.log(err);
              reject(err);
            }
            else{
              resolve();
            }
          });
        }
      });
    };

    if(req.user)
    {
      _makeSeq().then(function(){
        console.log('거래번호 채번 성공 : ', in_deal_no);
        return _insertTradeinfo();
      })
      .then(function(){
        return _qryBalanceInfo();
      })
      .then(function(balance_info){
        return _insertOrUdateBalanceInfo(balance_info);
      })
      .then(function(){
        res.redirect('/')
      })
      .catch(function(err){
          res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
      });
    }
    else {
      res.render('auth/login');
    }
  });

  route.get('/edit', function(req, res) {

  });

  route.post('/edit', function(req, res){

    if(req.user)
    {
      var in_deal_dt        = req.body.deal_dt;
      var in_deal_no        = req.body.deal_no;
      var in_id             = req.user.id;
      var in_deal_tp        = req.body.deal_tp;
      var in_crnc_code      = req.body.crnc_code;
      var in_key_crnc_code  = req.body.key_crnc_code;
      var in_qry            = req.body.qry;
      var in_unit_prc       = req.body.unit_prc;
      var in_deal_amt       = req.body.deal_amt;
      var in_cmsn_amt       = req.body.cmsn_amt;

      var params= [in_deal_tp, in_crnc_code, in_key_crnc_code, in_qry, in_unit_prc, in_deal_amt, in_cmsn_amt, in_deal_dt, in_deal_no, in_id];

      var sql = `UPDATE trade_info SET
                 deal_tp = ?,
                 crnc_code = ?,
                 key_crnc_code = ?,
                 qry = ?,
                 unit_prc = ?,
                 deal_amt = ?,
                 cmsn_amt = ?
                 WHERE deal_dt = ?
                   AND deal_no = ?
                   AND user_id = ?
                `;

      conn.query(sql, params, function(err, rows, fields){

        if(err){
          res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
        }
        else{
          res.redirect('/yield');
        }

      })
    }
    else {
      res.render('auth/login');
    }
  });

  route.get('/delete', function(req, res) {

  });

  route.post('/delete', function(req, res){

    if(req.user)
    {
      var in_deal_dt        = req.body.deal_dt;
      var in_deal_no        = req.body.deal_no;
      var in_id             = req.user.id;

      var sql = `DELETE FROM trade_info
                  WHERE deal_dt = ?
                    AND deal_no = ?
                    AND user_id = ?
                `;

      conn.query(sql, [in_deal_dt, in_deal_no, in_id], function(err, rows, fields){

        if(err){
          res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
        }
        else{
          res.redirect('/yield');
        }
      });
    }
    else {
          res.render('auth/login');
    }
  });

  return route;
}
