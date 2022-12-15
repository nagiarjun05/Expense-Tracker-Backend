const User=require('../models/User');
const Expense=require('../models/expense');

const getLeaderboard=async(req, res)=>{
    try{
        const users=await User.findAll();
        const expenses=await Expense.findAll();
        const userAggregateExpense={};
        expenses.forEach((element) => {
            if(userAggregateExpense[element.userId]){
                userAggregateExpense[element.userId]=userAggregateExpense[element.userId]+element.amount;
            }else{
                userAggregateExpense[element.userId]=element.amount;
            }
        });
        const userLeaderBoard=[];
        users.forEach((user)=>{
            userLeaderBoard.push({name: user.name, total: userAggregateExpense[user.id]})
        });
        userLeaderBoard.sort((a,b)=> b.total -a.total);
        res.status(200).json(userLeaderBoard);
    }   
    catch(err){
        res.status(500).json(err);
    }
};

module.exports={
    getLeaderboard
}