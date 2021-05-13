const express=require('express');
const router = express.Router();
const main =require('./main');
const user = require('./user')
const board = require('./board');
const comment = require('./comment')

router.use('/comment', comment);
router.use('/board',board)
router.use('/user', user);
router.use('/', main);


module.exports=router;