const User = require('../models/userModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const sequelize=require('../config/database');


exports.createUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, email, password } = req.body;
        const hashPassword=await bcrypt.hash(password,10);
        const user = await User.create({ name, email, password:hashPassword }, { transaction: t });
        await t.commit();
        return res.status(201).json({ user, Message: 'SignUp Successful' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ Error: 'Error Signing Up User' });
    }
};

exports.createLogin= async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({where:{email:email}});
       
        if(!user){
            return res.status(400).json({Error:'User does not exits'});
        }

         const passMatch=await bcrypt.compare(password,user.password);
         if(!passMatch){
            return res.status(400).json({Error:'Incorrect Password'});
         }
        const token=jwt.sign({id:user.id,name:user.name,email:user.email,isPremium:false},'secrect@key');
         return res.status(200).json({Message:'Login Successful',
                                      token,
                                      isPremium:user.isPremium});


    } catch (error) {
         return res.status(500).json({Error:'creating Login details'});
    }
}
