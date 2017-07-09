module.exports = function(){

  var route = require('express').Router();
  var conn = require('../config/db')();

  route.get('', function(req, res){

    if(req.user)
    {
      var sql = `SELECT deal_dt
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

      conn.query(sql, [req.user.user_id], function(err, rows, fields){

        var db_trade_info = rows;

        if(err){
          console.log(err);
          res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
        }
        else{
          console.log('root 진입 : ', req.user);
          console.log('root 진입 : ', db_trade_info);
          res.render('yield/view', {trade_infos:db_trade_info, user:req.user});
        }

      });

      // db.select(
      //   'deal_dt',
      //   'deal_no',
      //   'deal_tp',
      //   'crnc_code',
      //   'key_crnc_code',
      //   'qry',
      //   'unit_prc',
      //   'deal_amt',
      //   'cmsn_amt'
      // ).from('traninfo').
      // where(
      //   {user_id:req.user.user_id}
      // )
      // .all().then(function(db_traninfos){
      //
      //   console.log('root 진입 : ', req.user);
      //   console.log('root 진입 : ', db_traninfos);
      //   res.render('yield/view', {traninfos:db_traninfos, user:req.user});
      //
      // }, function(err){
      //   res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
      // });
    }
    else {
      res.render('auth/login');
    }
  });

  route.get('/add', function(req, res) {

    res.render('yield/add', {user:req.user});

    // db.select().from('traninfo')
    //   .all().then(function(db_traninfos){
    //         res.render('yield/add', {traninfoss:db_traninfos, user:req.user});
    //   }, function(err){
    //       res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
    //   });
  });

  route.post('/add', function(req, res){

    console.log('add', req.body);

    var in_deal_dt        = req.body.deal_dt;
    var in_deal_no
    var in_user_id        = req.user.user_id;
    var in_deal_tp        = req.body.deal_tp;
    var in_crnc_code      = req.body.crnc_code;
    var in_key_crnc_code  = req.body.key_crnc_code;
    var in_qry            = req.body.qry;
    var in_unit_prc       = req.body.unit_prc;
    var in_deal_amt       = req.body.deal_amt;
    var in_cmsn_amt       = req.body.cmsn_amt;

    var params = [in_deal_dt, in_user_id, in_deal_tp, in_crnc_code, in_key_crnc_code, in_qry, in_unit_prc, in_deal_amt, in_cmsn_amt];

    var sql = `INSERT INTO trade_info(
                deal_dt,
                user_id,
                deal_tp,
                crnc_code,
                key_crnc_code,
                qry,
                unit_prc,
                deal_amt,
                cmsn_amt)
               VALUES(?, ?, ?, ?, ?, ?, ? ,? ,?)`;

    conn.query(sql, params, function(err, rows, fields){

      if(err){
        console.log(err);
        res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
      }
      else{
        console.log('redirect root');
         res.redirect('/')
      }
    });

    // db.select('max(deal_no)').from('traninfo')
    //   .where(
    //     {
    //       deal_dt:in_deal_dt
    //     }
    //   ).one().then(function(db_traninfo){
    //
    //     console.log('거래내역 insert');
    //     db.insert().into('traninfo').set(
    //       {
    //         deal_dt : fm_deal_dt ,
    //         deal_no : in_deal_no,
    //         user_id : in_user_id,
    //         deal_tp : in_deal_tp,
    //         key_crnc_code : in_key_crnc_code,
    //         crnc_code : in_crnc_code,
    //         qry : in_qry,
    //         unit_prc : in_unit_prc,
    //         deal_amt : in_deal_amt,
    //         cmsn_amt : in_cmsn_amt
    //       }
    //     ).one().then(function(db_traninfo){
    //       console.log('redirect root');
    //       res.redirect('/')
    //     }, function(err){
    //         console.log(err);
    //         res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
    //     });
    //
    //   }, function(err){
    //       console.log(err);
    //       res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
    //   });
  });

  route.get('/edit', function(req, res) {

  });

  route.post('/edit', function(req, res){

    var in_deal_dt        = req.body.deal_dt;
    var in_deal_no        = req.body.deal_no;
    var in_user_id        = req.body.user_id;
    var in_deal_tp        = req.body.deal_tp;
    var in_crnc_code      = req.body.crnc_code;
    var in_key_crnc_code  = req.body.key_crnc_code;
    var in_qry            = req.body.qry;
    var in_unit_prc       = req.body.unit_prc;
    var in_deal_amt       = req.body.deal_amt;
    var in_cmsn_amt       = req.body.cmsn_amt;

    var params= [in_deal_tp, in_crnc_code, in_key_crnc_code, in_qry, in_unit_prc, in_deal_amt, in_cmsn_amt, in_deal_dt, in_deal_no, in_user_id];

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

    // db.update('traninfo').set(
    //   {
    //     deal_dt : in_deal_dt,
    //     deal_no : in_deal_no,
    //     deal_tp : in_deal_tp,
    //     key_crnc_code : in_key_crnc_code,
    //     crnc_code : in_crnc_code,
    //     qry : in_qry,
    //     unit_prc : in_unit_prc,
    //     deal_amt : in_deal_amt,
    //     cmsn_amt : in_cmsn_amt
    //   }
    // ).where(
    //   {
    //       '@rid':in_id
    //   }
    // ).one().then(function(results_cnt){
    //
    //   res.redirect('/');
    // }, function(err){
    //     res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
    // });
  });

  route.get('/delete', function(req, res) {

    // db.select().from('traninfo')
    // .all().then(function(db_traninfos){
    //
    //   db.select().from('traninfo')
    //     .where(
    //       {
    //         '@rid':req.params.id
    //       }
    //     ).one().then(function(db_traninfo){
    //           res.render('topic/delete', {traninfos:db_traninfos, traninfo:db_traninfo, user:req.user});
    //     }, function(err){
    //         res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
    //     });
    // });
  });

  route.post('/delete', function(req, res){

    var in_deal_dt        = req.body.deal_dt;
    var in_deal_no        = req.body.deal_no;
    var in_user_id        = req.body.user_id;

    var sql = `DELETE FROM trade_info
                WHERE deal_dt = ?
                  AND deal_no = ?
                  AND user_id = ?
              `;

    conn.query(sql, [in_deal_dt, in_deal_no, in_user_id], function(err, rows, fields){

      if(err){
        res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
      }
      else{
        res.redirect('/yield');
      }
    });

    // var in_id = req.params.id;
    // db.delete().from('traninfo').where(
    //   {
    //       '@rid':in_id
    //   }
    // ).one().then(function(results_cnt){
    //   res.redirect('/topic');
    // }, function(err){
    //     res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
    // });
  });

  return route;
}
