module.exports = function(app){

  var conn = require('./db')();
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var bkdf2Password = require('pbkdf2-password');
  var hasher = bkdf2Password();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user.auth_id);
  });

  passport.deserializeUser(function (id, done) {

    console.log('deserializeUser', id);

    var sql = 'SELECT * FROM user WHERE auth_id = ?'

    conn.query(sql , [id], function(err, rows, fields){

      var user = rows[0];

      if(err){
        res.status(500).send('문제가 발생했습니다. 빠른 시일안에 해결하겠습니다.');
      }
      else{
        if(user){
          console.log('deserializeUser success', user);
          done(null, user);
          //req.user 로 접근할 수 있다.
        }
        else {
          done('There is no user.',false);
        }
      }
    });


    // var users = db.select().from('user')
    // .where
    // (
    //   {authId: id}
    // )
    // .all()
    // .then
    // (
    //   function (select)
    //   {
    //       var user = select[0];
    //       if(select.length === 0){
    //         done('There is no user.',false);
    //       }
    //       else {
    //         console.log('deserializeUser success', user);
    //         done(null, user);
    //         //req.user 로 접근할 수 있다.
    //       }
    //   }
    // )
  });

  passport.use('local', new LocalStrategy({
      passReqToCallback:true
    },
      function (req, username, password, done)
      {
        var sql = 'SELECT * FROM user WHERE auth_id = ?'

        var auth_id = 'local:'+username;

        conn.query(sql , [auth_id], function(err, rows, fields){

          if(err){
            console.log(err);
          }
          else {
            var user = rows[0];
            if(user){
              hasher({password:password, salt:user.salt},
                function (err, pass, salt, hash){
                  if(hash === user.password){
                    console.log('login sucess user',user);
                    done(null, user);
                  }
                  else{
                    done(null, false, req.flash('loginMessage', '패스워드가 일치하지 않습니다'));
                  }
                });
            }
            else{
              console.log('login fail');
              done(null, false, req.flash('loginMessage', 'id가 잘못되었습니다'));
            }
          }
        });


        // var users = db.select().from('user')
        // .where
        // (
        //   {authId:'local:'+username}
        // )
        // .all()
        // .then
        // (
        //   function (select)
        //   {
        //     if(select.length === 0){
        //       console.log('login fail user:'+select);
        //       return done(null, false);
        //     }
        //
        //     var user = select[0];
        //     hasher({password:password, salt:user.salt},
        //       function (err, pass, salt, hash)
        //       {
        //         if(hash === user.password)
        //         {
        //           console.log('login sucess user',user);
        //           done(null, user);
        //         }
        //         else
        //         {
        //           done(null, false);
        //         }
        //       }
        //     )
        //   }
        // )
    })
);

  return passport;
}
