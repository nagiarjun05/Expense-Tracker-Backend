const express=require('express');

const forgetpasswordController=require('../controllers/forgetpassword');

const router=express.Router();

router.use('/forgetpassword', forgetpasswordController.forgetpassword)

// router.get('/forgetpassword', forgetpasswordController.)

// router.use('/forgetpassword', forgetpasswordController.)


module.exports=router;