const express=require('express');

const purchaseController=require('../controllers/purchase');
const userAuthentication=require('../middleware/auth');

const router=express.Router();

router.get('/premiummembership', userAuthentication.authentication ,purchaseController.purchasePremimum)

router.post('/updatetransaction', userAuthentication.authentication, purchaseController.updateTransactionStatus)

module.exports=router;