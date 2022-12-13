const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function stringValidator(string){
    if(string===undefined||string.length===0){
        return true
    }else{
        return false
    }
}

function generateTokken(id,name){
    return jwt.sign({userId: id, name: name}, 'secretToken')
}

const signup= async (req, res)=>{
    try{
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        // console.log(name);
        // console.log(email);
        // console.log(password);

        if (stringValidator(name)||stringValidator(email)||stringValidator(password)){
            console.log("error")
            return res.status(400).json({err: "Bad Parameters . Something is missing"})
        }

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async(err, hash)=>{
            await User.create({
                name: name,
                email: email,
                password: hash
            });
            await res.status(201).json({success: true, message: "Succesfully create new User"});
        }) 
    } catch(err){
        res.status(500).json(err);
    }
};

const login=async (req, res)=>{
    try{
        const {email, password}=req.body;

        const users= await User.findAll({ where : { email }})
                
        if (users.length>0){
            bcrypt.compare(password, users[0].dataValues.password, (err, result)=>{
                if(err){
                    throw new Error('Something went wrong')
                }
                else if(result){
                    return res.status(200).json({success: true, message: 'User Loged in Succesfully!', token:(generateTokken(users[0].dataValues.id,users[0].dataValues.name))})
                }
                else{
                    return res.status(400).json({success: false, message: 'Password is Inconrrect!'})
                }
            })
        }else{
            return res.status(404).json({success: false, message: 'User Doesnt Exist!'})
        }
    }
    catch(err){
        res.status(500).json({
            message: err
        })
    }
};

// const deleteUser=async (req, res)=>{
//     const uId=req.params.id;
//     await User.destroy({where:{id: uId}});
//     res.sendStatus(200);
// };

module.exports={
    signup,
    login
    // deleteUser
};