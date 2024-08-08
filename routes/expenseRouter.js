const express=require('express');
const expenseController=require('../controllers/expenseController');
const verifyToken=require('../middleware/authMiddleware');
const router=express();

router.post('/addexpense',verifyToken,expenseController.createExpense);
router.get('/addexpense',verifyToken,expenseController.getExpenses);
router.delete('/addexpense/:id',verifyToken,expenseController.deleteExpense);

router.get('/expenses/daily', verifyToken, expenseController.getDailyExpenses);
router.get('/expenses/monthly', verifyToken, expenseController.getMonthlyExpenses);
router.get('/expenses/yearly', verifyToken, expenseController.getYearlyExpenses);

module.exports=router;