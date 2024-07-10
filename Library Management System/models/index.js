const Sequelize=require('sequelize');
const sequelize=require('../config/database');

const Book=sequelize.define('books',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

const Returnbook=sequelize.define('books1',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    time:{
        type:Sequelize.DATE,
        allowNull:false
    },
    fine:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})
module.exports={Book,Returnbook};