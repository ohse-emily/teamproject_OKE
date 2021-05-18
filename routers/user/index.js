const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const multer = require('multer'); //npm install multer
const path = require('path'); //npm install path

/* 가져다쓰기 외우기 */
const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,'uploads/')//폴더명
        },
        filename:function(req,file,callback){
            callback(null,new Date().valueOf()+ path.extname(file.originalname))
        } //path.extname(file.originalname)): 확장자 가져오는 코드
    }),
})
//해당폴더의 하위 URL을 관리하는 파일.
// localhost:3000/대분류/중분류
// localhost:3000/user/[중분류]
// npm install multer
// 아래 각각에는 next가 존재할 것이다.
router.get('/join',userController.join) // http://localhost;3000/user/join
router.get('/login',userController.login)
router.get('/logout',userController.logout);
router.get('/info',userController.info)
router.post('/join_success', upload.single('img'),userController.join_success);
router.post('/login_check',userController.login_check);
router.get('/userid_check', userController.userid_check);
router.get('/info_modify', userController.info_modify);
router.post('/info_after_modify',  upload.single('img'), userController.info_after_modify);
router.post('/user_memo', userController.user_memo);

module.exports = router;