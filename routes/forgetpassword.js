const express=require('express');

const forgetpasswordController=require('../controllers/forgetpassword');

const router=express.Router();

router.use('/forgetpassword', forgetpasswordController.forgetpassword)

router.get('/resetpassword/:id', forgetpasswordController.resetpassword)

router.get('/updatepassword/:id', forgetpasswordController.updatepassword)


module.exports=router;