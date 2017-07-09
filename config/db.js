module.exports= function(){
  var mysql = require('mysql');
  var config = require('./config.js');
  var conn = mysql.createConnection({
    host:config.get('database.host'),
    port:config.get('database.port'),
    user:config.get('database.user'),
    password:config.get('database.password'),
    database:config.get('database.name')
  });

  conn.connect();

  return conn;
}
