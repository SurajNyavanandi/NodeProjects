const express=require('express');
const router=express.Router();
const premiumController=require('../controllers/premiumController');
const authMiddleware=require('../middleware/authMiddleware');
router.post('/createOrder',authMiddleware,premiumController.createOrder);
router.post('/updateOrderStatus',authMiddleware,premiumController.updateOrderStatus);
router.post('/updatePremiumStatus',authMiddleware,premiumController.updatePremiumStatus);
router.get('/leaderboard',premiumController.getLeaderboard);

module.exports=router;