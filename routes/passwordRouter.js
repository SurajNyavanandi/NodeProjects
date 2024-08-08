const express = require('express');
const passwordController = require('../controllers/passwordController');
const router = express.Router();

router.post('/forgotpassword', passwordController.forgotPassword);
router.post('/resetpassword/:id', passwordController.resetPassword); 

module.exports = router;
