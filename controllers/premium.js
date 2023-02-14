const User=require('../models/User');
const Expense=require('../models/expense');
const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const getLeaderboard=async(req, res)=>{
    try{
        const users=await User.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total']],
            include:[
                {
                    model: Expense,
                    attributes:[]
                }
            ],
            group:['user.id'],
            order:[['total','DESC']]
        });
        res.status(200).json(users);
        
        
        // BRUTE FORCE WAY TO SOLVE THIS
        // users= await User.findAll();
        // expenses= await Expense.findAll();
        // const userAggregateExpense={};
        // expenses.forEach((element) => {
        //     if(userAggregateExpense[element.userId]){
        //         userAggregateExpense[element.userId]=userAggregateExpense[element.userId]+element.amount;
        //     }else{
        //         userAggregateExpense[element.userId]=element.amount;
        //     }
        // });
        // const userAggregateExpense=await Expense.findAll({
        //     attributes: ['userId',[sequelize.fn('sum',sequelize.col('amount')),'total']],
        //     group: ['userId']
        // });// const userLeaderBoard=[];
        // users.forEach((user)=>{
        //     userLeaderBoard.push({name: user.name, total: userAggregateExpense[user.id]||0})
        // });
        // userLeaderBoard.sort((a,b)=> b.total -a.total);
        // res.status(200).json(userLeaderBoard);
    }   
    catch(err){
        res.status(500).json(err);
    }
};

module.exports={
    getLeaderboard
}