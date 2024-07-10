const Sequelize=require('sequelize');
const sequelize=new Sequelize('demo','root','tomvirat',{
    dialect:'mysql',
    host:'localhost'
})
module.exports=sequelize;