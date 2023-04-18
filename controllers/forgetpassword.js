const User=require('../models/User')
const sgMail = require('@sendgrid/mail')
// const uuid=require('uuid');
const ForgetPassword = require('../models/forgetpassword');

const bcrypt=require('bcrypt');


const forgetpassword=async(req, res)=>{
    try{
        const email=req.headers.email;

        // Sequelize way 
        // const user=await User.findOne({where:{email}})

        // mongoose way
        const user= await User.find({'email':email})

        if(user.length>0){
            // Sequelize way
            // const id=uuid.v4();
            // user.createForgetpassword({id,active:true})

            // mongoose way
            const id=user[0]._id
            // console.log(id)
            const newPasswordLink=await new ForgetPassword({
                active:true,
                userId:id
            })
            .save().catch((err)=>{
                console.log(err)
            })

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'nagiarjun05@gmail.com', // Change to your verified sender
                subject: 'To reset password',
                text: `This is your link to reset your account's password`,
                html: `<a href='http://localhost:4000/password/resetpassword/${newPasswordLink._id}'>Reset password</a>`
              }

            console.log(`href='http://localhost:4000/password/resetpassword/${newPasswordLink._id}`)
              
            sgMail
            .send(msg)
            .then((response) => {
                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message:"Link to reset password sent to your mail", succes: true})
            })
            .catch((error) => {
                console.log(error)
                throw new Error(error)
            })
        }else{
            return res.status(404).json({message:`User Doesn't exist`, success:false})
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: err, success:false})
    }  
}


const resetpassword=async(req, res)=>{
    try{
        const id=req.params.id;

        const forgetId= await ForgetPassword.findById(id)
        const user=await User.findById(forgetId.userId);
        if (user){
            res.status(200).send(`<html>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New Password :</label>
                                        <input type="password" name="newpassword"></input>
                                        <button>Reset Password</button>
                                    </form>
                                </html>`)
            res.end()
            }
        }
    catch{
        console.log(err);
        return res.json({message: err, success:false})
    }
};

const updatepassword=async (req, res)=>{
    try{
        const {newpassword} = req.query;
        const {id}=req.params;

        //Sequelize way
        // ForgetPassword.find({'userId':id})
        // .then((request)=>{
        //     User.findById({'_id':id})
        //     .then((user)=>{})

        //Mongoose way
        const forgetPassword=await ForgetPassword.findByIdAndUpdate(id,{active:false});
        const user=await User.findById(forgetPassword.userId);

        if(user){
            const saltRounds=10;
            bcrypt.hash(newpassword, saltRounds, async function(err, data){
                if(err){
                    throw new Error(err)
                }

                //Sequelize way
                // user.update({password: data})

                //Mongoose way
                await User.findByIdAndUpdate(user._id,{password:data})
                await ForgetPassword.findOneAndRemove(id);
        
                res.status(201).send(`<html>
                                        <div>
                                            <h1>"Successfully update the password"</h1>
                                        </div>
                                        <div>
                                            <h1><a href='http://localhost:4000/login.html'>"Login in your account"</a></h1>
                                        </div>
                                    </html>`)
                res.end()             
            })
        }else{
            return res.status(404).json({message: "No user exist", succes: false})
             }
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