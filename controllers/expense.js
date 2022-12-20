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
        const page= +req.query.page || 1;
        let ITEM_PER_PAGE=+req.headers.rowperpage || 2;
        console.log(req.headers.rowperpage)

        const totalCount = await Expense.count({where:{userId:req.user.id}});
        const expenses=await Expense.findAll({
            where:{userId:req.user.id},
            offset: (page-1)*ITEM_PER_PAGE,
            limit:ITEM_PER_PAGE
        })

        res.status(200).json({
            allExpenses: expenses, 
            premiumuser:req.user.ispremiumuser,
            currentPage:page,
            hasNextPage:ITEM_PER_PAGE*page<totalCount,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            lastPage:Math.ceil(totalCount/ITEM_PER_PAGE)
        });
    }
    catch(err){
        console.log(err)
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

module.exports={
    addExpense,
    getExpenses,
    deleteExpense
};