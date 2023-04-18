const Razorpay=require('razorpay');
const Order=require('../models/order');
const User=require('../models/User')
const jwt=require('jsonwebtoken');

function generateTokken(id,name, ispremiumuser){
    return jwt.sign({userId: id, name: name, ispremiumuser: ispremiumuser}, 'secretToken')
};

const purchasePremimum=async (req, res)=>{
    try{
        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })

        rzp.orders.create({amount:10000, currency:"INR"}, (err, order) =>{
            if(err){
                console.log(err)
                throw new Error(err);
            }
            
            //Seqelized way
            // req.user.createOrder({orderid:order.id,status:"PENDING"})
            // console.log(order)

            //Mongoose way
            new Order({
                orderid: order.id,
                status: "PENDING",
                userId: req.user.id
            }).save()

            return res.status(201).json({order, key_id: rzp.key_id})
        })
    }
    catch{
        return res.status(403).json({message:'Something went wrong!',error:err})
    }   
}


const updateTransactionStatus=async (req, res)=>{
    try{
        // console.log(req.body)
        const{order_id,payment_id}=req.body;
        
        //Sequelize way
        // Order.find({where: {orderid: order_id}})
        // .then((order)=>{
        //     order.update({paymentid:payment_id, status:'SUCCESSFUL'})
        //     .then(()=>{
        //         req.user.update({ispremiumuser: true})
        //         return res.status(202).json({success: true, message:'Transaction Successful!!', token: generateTokken(req.user.id, req.user.name, req.user.ispremiumuser)})
        //     })
        //     .catch((err)=>{
        //         throw new Error(err)
        //     })
        // })
        // .catch((err)=>{
        //     throw new Error(err)
        // })

        //Mongoose way
        const filter={'orderid': order_id};
        const update={paymentid:payment_id, status:'SUCCESSFUL'}
        await Order.findOneAndUpdate(filter,update,{
            new: true,
            upsert: true
        });
        await User.findByIdAndUpdate(req.user._id,{ispremiumuser: true},{upsert:true})
        return res.status(202).json({success: true, message:'Transaction Successful!!', token: generateTokken(req.user.id, req.user.name, req.user.ispremiumuser)})
    }
    catch(err){
        res.status(403).json({error: err, message:'Something went wrong'})
    }
}

module.exports={
    purchasePremimum,
    updateTransactionStatus   
};  