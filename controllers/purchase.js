const Razorpay=require('razorpay');
const Order=require('../models/order');
const User=require('../models/User')
const jwt=require('jsonwebtoken');

function generateTokken(id,name, ispremiumuser){
    return jwt.sign({userId: id, name: name, ispremiumuser: ispremiumuser}, 'secretToken')
}

const purchasePremimum=async (req, res)=>{
    try{
        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })

        const amount=100;

        rzp.orders.create({amount, currency:"INR"}, (err, order) =>{
            if(err){
                console.log(err)
                throw new Error(err);
            }
            
            //Seqelized way
            // req.user.createOrder({orderid:order.id,status:"PENDING"})

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
        res.status(403).json({message:'Something went wrong!',error:err})
    }   
}


const updateTransactionStatus=(req, res)=>{
    try{
        // console.log(req.user)
        const{payment_id,order_id}=req.body;
        
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

        // console.log(order_id)
        // const query = {'orderid': order_id};
        // Order.findOneAndUpdate(query,{paymentid:payment_id, status:'SUCCESSFUL'},{upsert:true})
        // User.findByIdAndUpdate(req.user._id,{ispremiumuser:true})
        User.findById(req.user._id).exec().then((user)=>{
            return user.update({ispremiumuser: true})
        })

        Order.findOne({orderid: `${order_id}`}).exec()
        .then((order)=>{
            return order.update({paymentid:payment_id, status:'SUCCESSFUL'}).then(()=>{
                return res.status(202).json({success: true, message:'Transaction Successful!!', token: generateTokken(req.user.id, req.user.name, req.user.ispremiumuser)})        
            })
        })

        // .then((order)=>{
        //         order.update({paymentid:payment_id, status:'SUCCESSFUL'})
        // })

        // User.findByIdAndUpdate(req.user._id,{ispremiumuser: true},{upsert:true}?)
        // return res.status(202).json({success: true, message:'Transaction Successful!!', token: generateTokken(req.user.id, req.user.name, req.user.ispremiumuser)})

        
    }
    catch{
        res.status(403).json({error: err, message:'Something went wrong'})
    }
}

module.exports={
    purchasePremimum,
    updateTransactionStatus   
};  