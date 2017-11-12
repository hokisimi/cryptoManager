const config = require('./config/config.js');
const app = require('./config/express')();
const passport = require('./config/passport')(app);
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

/* 인덱스 라우터 */
const index = require('./routers/index')();
app.use('', index);

/* 인증 라우터 */
const auth = require('./routers/auth')(passport);
app.use('/auth', auth);

/* 거래내역 라우터 */
const yield = require('./routers/yield')();
app.use('/yield', yield);

/* 잔고 라우터 */
const portfolio = require('./routers/portfolio')(io);
app.use('/portfolio', portfolio);

/* 서버가동 */
httpServer.listen(config.get('port'), function(){

  console.log('Connected ' + config.get('port') + 'port');
});
