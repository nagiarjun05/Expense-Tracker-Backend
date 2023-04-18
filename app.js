const express = require('express')
// const fs=require('fs');
// const https=require('https');
const cors= require('cors');
const app = express();


const mongoose=require('mongoose');

const dotenv=require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

// const sequelize =require('./util/database')
// const User=require('./models/User');
// const Expense=require('./models/expense')
// const Order=require('./models/order');
// const ForgetPassword = require('./models/forgetpassword');
// const FilesDownloaded=require('./models/downloadedfiles');

app.use(cors());

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumRoutes=require('./routes/premium');
const forgetpasswordRoutes=require('./routes/forgetpassword');
const path = require('path');


// To handle forms
// app.use(bodyParser.urlencoded({ extended: false })); 

// To handle json
app.use(bodyParser.json());

app.use('/users',userRoutes);
app.use('/expenses',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',forgetpasswordRoutes);


app.use((req, res)=>{
    // console.log('urlll', req.url);
    res.sendFile(path.join(__dirname, `public/${req.url}`))
});




// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(ForgetPassword);
// ForgetPassword.belongsTo(User);

// User.hasMany(FilesDownloaded);
// FilesDownloaded.belongsTo(User);

// sequelize
// .sync()
// // .sync({force: true})
// .then(cart=>{
//     // https
//     // .createServer(app)
//     app.listen(4000);
// })
// .catch(err=>{
//     console.log(err)
// });


// Mongoose connection
mongoose.connect('mongodb+srv://arjun:simran@cluster0.rjlptec.mongodb.net/expenseTracker?retryWrites=true&w=majority')
.then(()=>{
  app.listen(4000)
})
.catch(err=>console.log(err))