// const Sequelize=require('sequelize');
// const sequelize=require('../util/database');

// const Order=sequelize.define('order',{
//     id:{
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: true
//     },
//     paymentid:Sequelize.STRING,
//     orderid:Sequelize.STRING,
//     status:Sequelize.STRING
// });


// module.exports=Expense;
const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const orderSchema=new Schema({
    paymentid:{
        type: String,
    },
    orderid:{
        type: String,
    },
    status:{
        type: String,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports=mongoose.model('Order', orderSchema);;