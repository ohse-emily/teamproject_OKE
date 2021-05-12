const express=require('express');
const router = express.Router();
const userController = require('./user.controller')

router.get('/info',userController.info);
router.get('/join_success',userController.join_success);
router.get('/login',userController.login);
router.get('/join',userController.join);



module.exports=router;