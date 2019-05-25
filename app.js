const express = require('express'); 
const nunjucks = require('nunjucks');
const logger = require('morgan');   
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// db 관련
const db = require('./models');

// DB authentication
db.sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
    // return db.sequelize.drop();
    // return db.sequelize.sync();
})
.then(() => {
    console.log('DB Sync complete.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const admin = require('./routes/admin');
const accounts = require('./routes/accounts');

const app = express();
const port = 3000;


// teamplate은 폴더명, 라우팅위에 위치, nunjunck의 문법을 사용할수있다.s
nunjucks.configure('template', {
    autoescape: true,
    express: app
});

// 미들웨어 셋팅, 라우팅 위에 위치
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//업로드 path 추가
app.use('/uploads', express.static('uploads')); //url이 uploads 일떄 폴더위치(uploads) 안에 있는 폴더를 보여주는것. 

console.log(__dirname);

app.get('/',function(req, res){
    res.send('first app!'); 
});

app.use('/admin',admin);
app.use('/accounts',accounts);

app.listen(port,function(){ //http create server에 할당
    console.log('Express listening on port',port);
});