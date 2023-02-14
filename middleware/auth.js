const jwt=require('jsonwebtoken');
const User=require('../models/User')
const authentication=(req, res, next)=>{
    try{
        const token=req.headers.authorization;
        const user=jwt.verify(token, 'secretToken')
        // console.log(user.userId)
        User.findById({'_id':user.userId})
        .then((user)=>{
            // if(JSON.stringify(user.ispremiumuser)){
            //     console.log("yes");
            // }
            req.user=user;
            next();
        })
    }
    catch(err){
        console.log(err);
        return res.status(401).json({success: false});
    }
};

module.exports={
    authentication
}