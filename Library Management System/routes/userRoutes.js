const express=require('express');
const router=express.Router();
const UserController=require('../controllers/userController');

router.post('/book',UserController.createBook);
router.get('/book',UserController.getBooks);
router.delete('/book/:id',UserController.deleteBook);

router.post('/returnbook',UserController.createReturnBook);
router.get('/returnbook',UserController.getReturnBooks);

module.exports=router;
