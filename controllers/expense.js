const Expense = require('../models/expense');

const addExpense= async (req, res)=>{
    try{
        const amount=req.body.amount;
        const description=req.body.description;
        const category=req.body.category;
        console.log(req.user.id)
        const data = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        });
        res.status(201).json({newExpenseDetail: data});
    } catch(err){
        res.status(500).json({
            error: err
        })
    }
};

const getExpenses=async (req, res)=>{
    try{
        const expenses = await Expense.findAll({where:{userId:req.user.id}});
        // console.log(req.user.ispremiumuser)
        res.status(200).json({allExpenses: expenses, premiumuser:req.user.ispremiumuser});
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
};

const deleteExpense=async (req, res)=>{
    const uId=req.user.id;
    const eId=req.params.id;
    
    await Expense.destroy({where:{userId: uId, id: eId}});
    res.sendStatus(200);
};

// const updateExpense=async (req, res)=>{;
//     const uId=req.user.id;
//     const amount=req.body.amount;
//     const description=req.body.description;
//     const category=req.body.category;
    
//     await Expense.update({
//         amount: amount,
//         description: description,
//         category: category
//     },
//     {where:{id: uId}});
//     res.sendStatus(200);
// };

module.exports={
    addExpense,
    getExpenses,
    deleteExpense,
    // updateExpense
};