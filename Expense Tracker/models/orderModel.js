const Sequelize=require('sequelize');
const sequelize=require('../config/database');

const Order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    orderId:{
        type:Sequelize.STRING,
        allowNull:false
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId:{
       type:Sequelize.INTEGER,
       allowNull:false
    }
});

module.exports=Order;