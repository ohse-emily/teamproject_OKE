const express=require('express');
const router = express.Router();
const main =require('./main');
const user = require('./user')

router.use('/user', user);
router.use('/', main);


module.exports=router;