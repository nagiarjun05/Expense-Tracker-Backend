const express = require('express');
const cors= require('cors');
const app = express();

const dotenv=require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const sequelize =require('./util/database')

const User=require('./models/User');
const Expense=require('./models/expense')
const Order=require('./models/order');
// const errorController = require('./controllers/error');



app.use(cors());
app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumRoutes=require('./routes/premium');
// To handle forms
// app.use(bodyParser.urlencoded({ extended: false })); 

// To handle json
app.use(bodyParser.json())

// app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next)=>{
//     User.findByPk(1)
//     .then(user=>{
//         req.user=user;
//         next();
//     })
//     .catch(err=>console.log(err));
// });

app.use('/users',userRoutes);
app.use('/expenses',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);

// app.use(errorController.get404);

// Product.belongsTo(User,{ constraints: true, onDelete:"CASCADE"});
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product,{through: CartItem});
// Product.belongsToMany(Cart,{through: CartItem});
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product,{through: OrderItem});
// User.belongsTo(Review);
// Restaurant.hasMany(Review)
// Review.belongsToMany(User,{through: UserReview})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
.sync()
// .sync({force: true})
// .then((result)=>{
//     return User.findByPk(1);
// })
// .then((user)=>{
//     if(!user){
//         return User.create({name:'Arjun',email:'arjun@gmail.com',password:'9998885225'})
//     }
//     return user
// })
// .then(user=>{
//     return user.createCart()
// })
.then(cart=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err)
});

