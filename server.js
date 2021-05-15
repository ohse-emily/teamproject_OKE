const express=require('express');
const {sequelize} = require('./models');
const {User} =require('./models');
const app = express();
const routers = require('./routers')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const cors = require('cors');
const session = require('express-session');

app.set('view engine', 'html');
nunjucks.configure('views', {
    express:app,
})
app.use(express.static('uploads/'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());//바디파서가 json을 못 넘겨줘서 그래
app.use(cors());

app.use(session({
    secret:'aaa',
    resave:false,
    saveUninitialized:true,
    cookie:{                    //?뜻 
        httpOnly:true,
        secure:false
    }
}))

sequelize.sync({force:true})
.then(()=>{console.log('접속 완료')})
.catch(()=>{console.log('접속 실패 ')})

app.use('/',routers);

app.listen(3000,()=>{
    console.log('server start port : 3000');
})