const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const sampleSchema=new Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    age:{
        type:Number,
        require:true,
        unique:true
    }
});

module.exports=mongoose.model('Sample',sampleSchema);