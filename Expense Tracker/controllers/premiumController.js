const instance=require('../config/razorpay');
const Order=require('../models/orderModel');
const User=require('../models/userModel');
const sequelize=require('../config/database');

const jwtDecode=require('jwt-decode');
const jwt=require('jsonwebtoken');

exports.createOrder=async(req,res)=>{
  const t = await sequelize.transaction();
    try {
        const userId=req.userId;
        const amount=26000;
        const order=await instance.orders.create({amount:amount});
        await Order.create({orderId:order.id,amount:amount,status:'Pending',userId:userId}, { transaction: t });
        
        await t.commit();
        return res.status(201).json(order);
    } catch (error) {
      await t.rollback();
      return res.status(500).json({Error:'Error creating order'});  
    }
}
exports.updateOrderStatus=async(req,res)=>{
    try {
         const t = await sequelize.transaction();
         const {orderId}=req.body;
         const order=await Order.findOne({where:{orderId:orderId}},{ transaction: t });
         if(order){
           order.status='Successfull';
           await order.save({ transaction: t });
         }
         await t.commit();
         return res.status(200).json(order);
    } catch (error) {
      await t.rollback();
      return res.status(500).json({Error:'Error updating order status  '});  
    }
};
exports.updatePremiumStatus=async(req,res)=>{
  try {
      const t = await sequelize.transaction();
      const userId=req.userId;
      const user=await User.findOne({where:{id:userId}}, { transaction: t });

      if(user){
        user.isPremium=true;
        await user.save({ transaction: t });
        await t.commit();
        return res.status(201).json({Message:'Premium status updated successfully in DB'})
      }else{
        await t.rollback();
        return res.status(400).json({Error:'User not found to Update Premium Status'})
      }
      
  } catch (error) {
      await t.rollback();
      return res.status(500).json({Error:'Error updating premiumStatus in DB'})
  }
};

exports.getLeaderboard=async(req,res)=>{
  try {
    const users=await User.findAll({
      attributes:['name','totalAmount'],
      order:[['totalAmount','DESC']]
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({Error:'Error  Displaying Users in leaderboard'})
  }
}


