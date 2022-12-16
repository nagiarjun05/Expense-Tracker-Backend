const User=require('../models/User')
const sgMail = require('@sendgrid/mail')
const uuid=require('uuid');
const ForgetPassword = require('../models/forgetpassword');

const bcrypt=require('bcrypt');


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
                html: `<a href='http://localhost:4000/password/resetpassword/${id}'>Reset password</a>`
              }

            console.log(msg)
              
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


const resetpassword=(req, res)=>{
    const id=req.params.id;
    
    ForgetPassword.findOne({where:{id}})
    .then((user)=>{
        if (user){
            user.update({active: false})
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New Password :</label>
                                        <input type="password" name="newpassword"></input>
                                        <button>Reset Password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    })
}

const updatepassword=(req, res)=>{
    try{
        const { newpassword } = req.query;
        const {id}=req.params;

        ForgetPassword.findOne({where:{id}})
        .then((request)=>{
            User.findOne({where:{id:request.userId}})
            .then((user)=>{
                if(user){
                    const saltRounds=10;

                    bcrypt.hash(newpassword, saltRounds, function(err, data){
                        if(err){
                            throw new Error(err)
                        }

                        user.update({password: data})
                        .then(()=>{
                            res.status(201).json({message: "Successfully update the password"})
                        })
                    })
                }else{
                    return res.status(404).json({message: "No user exist", succes: false})
                }
           })
        })
    }
    catch(error){
        return res.status(403).json({error, succes: false})
    }
}
module.exports={
    forgetpassword,
    resetpassword,
    updatepassword
};