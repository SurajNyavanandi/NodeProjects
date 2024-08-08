const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const sequelize = require('../config/database');
const { getExpenses } = require('../services/userService'); 
const uploadToS3 = require('../services/S3service');
const { Op } = require('sequelize');

exports.createExpense=async(req,res)=>{
       const t=await sequelize.transaction();
    try {
        const userId=req.userId;
        const user=await User.findOne({where:{id:userId}},{transaction:t});
        const {amount,description,category}=req.body;
        const expense=await Expense.create({amount,description,category,userId},{transaction:t});

        if(expense){
            user.totalAmount=Number(expense.amount)+Number(user.totalAmount);
            await user.save({transaction:t});
        }
        await t.commit();
        return res.status(201).json(expense);

    } catch (error) {
        await t.rollback();
       return res.status(500).json({Error:'Error creating expense'}); 
    }
};
exports.getExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Expense.findAndCountAll({
            where: { userId: userId },
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            expenses: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({ Error: 'Error getting expenses' });
    }
};
exports.deleteExpense=async(req,res)=>{
    const t = await sequelize.transaction();
    try {
        const userId=req.userId;//via middleware
        const id=req.params.id;

        const user=await User.findOne({where:{id:userId}},{ transaction: t });
        const expense=await Expense.findOne({where:{id:id}}, { transaction: t })
        if(expense){
            user.totalAmount=Number(user.totalAmount)-Number(expense.amount);
            await user.save({ transaction: t });
            await Expense.destroy({where:{id:id}}, { transaction: t });
        } 
        await t.commit(); 
        return res.status(204).json();
    } catch (error) {
        await t.rollback();
        return res.status(500).json({Error:'Error deleting expense'});
    }
}
exports.getDailyExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        const endOfDay = new Date().setHours(23, 59, 59, 999);

        const expenses = await Expense.findAll({
            where: {
                userId: userId,
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });
        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({ Error: 'Error fetching daily expenses' });
    }
};
exports.getMonthlyExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const expenses = await Expense.findAll({
            where: {
                userId: userId,
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });
        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({ Error: 'Error fetching monthly expenses' });
    }
};
exports.getYearlyExpenses = async (req, res) => {
    try {
        const userId = req.userId;
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31);

        const expenses = await Expense.findAll({
            where: {
                userId: userId,
                createdAt: {
                    [Op.between]: [startOfYear, endOfYear]
                }
            }
        });
        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({ Error: 'Error fetching yearly expenses' });
    }
};
exports.downloadExpense = async (req, res) => {
    try {
        const userId = req.userId;
        const expenses = await getExpenses(userId); 
        const stringifiedExpenses = JSON.stringify(expenses);
        const filename = `Expense${userId}/(${new Date()}).txt`;
        const fileurl = await uploadToS3(stringifiedExpenses, filename);
        return res.status(200).json({ fileurl, Message: true });
    } catch (error) {
        console.error("Error downloading expense file", error);
        return res.status(500).json({ Error: 'Error downloading expense file' });
    }
};


