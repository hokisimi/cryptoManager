module.exports = function(passport){

  var route = require('express').Router();
  var bkdf2Password = require('pbkdf2-password');
  var hasher = bkdf2Password();
  var conn = require('../config/db')();

  route.get('/register', function(req, res) {
    res.render('auth/register');
    // db.select().from('topic')
    //   .all().then(function(db_topics){
    //         res.render('auth/register', {topics:db_topics});
    //   }, function(err){
    //       res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
    //   });
  });

  //register req and redirect view
  route.post('/register', function(req, res) {
    hasher({password: req.body.password}, function (err, pass, salt, hash) {

      var user = {
        user_id: req.body.username,
        auth_id:'local:'+req.body.username,
        password:hash,
        salt:salt,
        displayName:req.body.displayName,
      };

      var sql = `INSERT INTO user(
                  id,
                  auth_id,
                  password,
                  salt,
                  displayName
                )
                VALUES(?, ?, ?, ?, ?)`;

      conn.query(sql, [user.user_id, user.auth_id, user.password, user.salt, user.displayName], function(err, rows, fields){

        if(err){
          console.log(err);
          res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
        }
        else{
          console.log(user);
          req.login(user, function(err){
            req.session.save(function(){
              res.redirect('/');
            });
          })
        }
      });

      // db.insert().into('user')
      //   .set(user).one().then(function(user){
      //     console.log(user);
      //     req.login(user, function(err){
      //       req.session.save(function(){
      //         res.redirect('/');
      //       });
      //     })
      //   }, function(err){
      //
      //   });
    })
  });

  //login req and res view
  route.get('/login', function(req, res) {

    res.render('auth/login', {message:req.flash('loginMessage')});
    // db.select().from('topic')
    //   .all().then(function(db_topics){
    //         res.render('auth/login', {topics:db_topics});
    //   }, function(err){
    //       res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
    //   });
  });

  route.post('/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
      }
    )
  );

  //logout req and redirect view
  route.get('/logout', function(req, res) {
    req.logout();
    req.session.save(function (){
      res.redirect('/');
    })
  });

  route.get('/facebook',
    passport.authenticate('facebook', {scope:'email'}));

  route.get('/facebook/callback',
    passport.authenticate('facebook',{
      successRedirect: '/',
      failureRedirect: '/auth/login'}));

  return route;
}
