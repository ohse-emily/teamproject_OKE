const express=require('express');
const app = express();
const routers = require('./routers')
const {sequelize} = require('./models');
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')

nunjucks.configure('views', {
    express:app,
})

app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'html');

sequelize.sync({force:false})
.then(()=>{
    console.log('접속 완료')
})
.catch(()=>{
    console.log('접속 실패 ')
})

app.use('/',routers);

app.listen(3000,()=>{
    console.log('server start port : 3000');
})