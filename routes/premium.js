const express=require('express');

const premiumController=require('../controllers/premium');
const userAuthentication=require('../middleware/auth');

const router=express.Router();

router.get('/get-leaderboard', userAuthentication.authentication ,premiumController.getLeaderboard)

// router.post('/updatetransaction', userAuthentication.authentication, purchaseController.updateTransactionStatus)

module.exports=router;