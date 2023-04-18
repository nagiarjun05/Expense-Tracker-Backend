const express = require('express');

const router = express.Router();

const expenseController=require('../controllers/expense');
const userAuthentication=require('../middleware/auth')

router.post('/add-expense', userAuthentication.authentication ,expenseController.addExpense);

router.get('/get-expenses/:page', userAuthentication.authentication ,expenseController.getExpenses);

router.delete('/delete-expense/:id', userAuthentication.authentication ,expenseController.deleteExpense);

module.exports=router;