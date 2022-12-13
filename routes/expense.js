const express = require('express');

const router = express.Router();

const expenseController=require('../controllers/expense');
const userAuthentication=require('../middleware/auth')

router.post('/add-expense', userAuthentication.authentication ,expenseController.addExpense);

router.get('/get-expenses', userAuthentication.authentication ,expenseController.getExpenses);

// router.put('/update-expense/:id',expenseController.updateExpense);

router.delete('/delete-expense/:id', userAuthentication.authentication ,expenseController.deleteExpense);

module.exports=router;