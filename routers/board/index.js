const express=require('express');
const router = express.Router();
const boardController = require('./board.controller')

router.get('/main_board',boardController.main_board);
router.get('/write',boardController.write);
router.post('/view',boardController.view);
router.get('/modify',boardController.modify);
router.get('/delete',boardController.remove);


module.exports=router;