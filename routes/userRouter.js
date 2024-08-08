const express = require('express');
const userController = require('../controllers/userController');
const expenseController=require('../controllers/expenseController');
const verifyToken=require('../middleware/authMiddleware');
const urlController=require('../controllers/urlController');
const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login',userController.createLogin);
router.get('/download',verifyToken,expenseController.downloadExpense);


router.post('/url', verifyToken,urlController.postUrl);
router.get('/url',verifyToken,urlController.getUrls);

module.exports = router;

