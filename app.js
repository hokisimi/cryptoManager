var config = require('./config/config.js');
var app = require('./config/express')();
var passport = require('./config/passport')(app);
var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer);

/* 인덱스 라우터 */
var index = require('./routers/index')();
app.use('', index);

/* 인증 라우터 */
var auth = require('./routers/auth')(passport);
app.use('/auth', auth);

/* 수익률 라우터 */
var yield = require('./routers/yield')();
app.use('/yield', yield);

/* 잔고 라우터 */
var balance = require('./routers/balance')(io);
app.use('/balance', balance);

/* 서버가동 */
httpServer.listen(config.get('port'), function(){

  console.log('Connected' + config.get('port') + 'port');
});
