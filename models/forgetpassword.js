const Sequelize=require('sequelize');
const sequelize=require('../util/database')

const ForgetPassword=sequelize.define('forgetpassword',{
    id:{
        type:Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN
});


module.exports=ForgetPassword;