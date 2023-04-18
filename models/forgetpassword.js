// const Sequelize=require('sequelize');
// const sequelize=require('../util/database')

// const ForgetPassword=sequelize.define('forgetpassword',{
//     id:{
//         type:Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN
// });

// module.exports=ForgetPassword;

const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const forgetPasswordSchema= new Schema({
    active:{
        type:Boolean,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

module.exports=mongoose.model('ForgetPassword',forgetPasswordSchema);