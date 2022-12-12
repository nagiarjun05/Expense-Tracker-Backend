const express = require('express');

const router = express.Router();

const userController=require('../controllers/user');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

// router.delete('/delete-user/:id', userController.deleteUser);

module.exports=router;