const express=require('express');
const router = express.Router();
const boardController = require('./board.controller')

router.get('/main_board',boardController.main_board);
router.get('/write',boardController.write);
router.get('/view',boardController.view);
router.get('/modify',boardController.modify);
router.get('/remove',boardController.remove);
router.post('/view_after_write',boardController.view_after_write);
router.post('/view_after_modify', boardController.view_after_modify);
router.post('/comment_post',boardController.comment_post); 


module.exports=router;