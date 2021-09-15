const { Int32 } = require('bson');
const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema= mongoose.Schema({
       
        title:{
            type:String,
            required:false
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        author:{
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        discription:{
            type:String,
            required:false
        },
        status:{
            type:String,
            required:false,
        },
})

module.exports = mongoose.model('todos',TodoSchema)