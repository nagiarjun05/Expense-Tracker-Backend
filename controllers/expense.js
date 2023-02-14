const Expense = require('../models/expense');

const addExpense= async (req, res)=>{
    try{
        const amount=req.body.amount;
        const description=req.body.description;
        const category=req.body.category;
        // console.log(req.user.id)
        //Sequelize way
        // const data = await Expense.create({
        //     amount: amount,
        //     description: description,
        //     category: category,
        //     userId: req.user.id
        // });
        //Mongoose way
        const expense = await new Expense({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        }).save();
        // console.log(expense)
        res.status(201).json({newExpenseDetail: expense});
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
        // console.log(req.headers.rowperpage)

        // const totalCount = await Expense.count({where:{userId:req.user.id}});
        const totalCount = await Expense.count({'userId':req.user.id});
        
        //Sequelize way
        // const expenses=await Expense.findAll({
        //     where:{userId:req.user.id},
        //     offset: (page-1)*ITEM_PER_PAGE,
        //     limit:ITEM_PER_PAGE
        // })

        //Mongoose way
        const expenses=await Expense.find({'userId':req.user.id}).skip((page-1)*ITEM_PER_PAGE).limit(ITEM_PER_PAGE)

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
    // console.log(eId)
    await Expense.findByIdAndRemove({'_id': eId});
    res.sendStatus(200);
};

module.exports={
    addExpense,
    getExpenses,
    deleteExpense
};