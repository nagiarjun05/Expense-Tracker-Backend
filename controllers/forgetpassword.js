const User=require('../models/User')
const sgMail = require('@sendgrid/mail')
const uuid=require('uuid');


const forgetpassword=async(req, res)=>{
    try{
        const email=req.headers.email;
        console.log(email)

        const user=await User.findOne({where:{email}})
        if(user){
            const id=uuid.v4();
            user.createForgetpassword({id,active:true})
            .catch((err)=>{
                throw new Error(err)
            })

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'nagiarjun05@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href='http://localhost:4000/password/resetpassword/${id}'>Reset password</a>`,
              }
              
            sgMail
            .send(msg)
            .then((response) => {
                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message:"Link to reset password sent to your mail", succes: true})
            })
            .catch((error) => {
                throw new Error(error)
            })
        }else{
            throw new Error(`User Doesn't exist`)
        }
    }
    catch(err){
        console.log(err);
        return res.json({message: err, success:false})
    }  
}


// const resetpassword=(req, res)=>{
//     const id=
// }
module.exports={
    forgetpassword
};