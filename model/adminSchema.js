const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
    },
    { timestamps:true}
)

adminSchema.pre('save',async function(next){
  if(this.isModified('password')){
     this.password = bcrypt.hashSync(this.password,12);
     this.confirmPassword = bcrypt.hashSync(this.confirmPassword,12);
    }
  next();
});

adminSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(error){
      console.log(error);
    }
}

const Admin = mongoose.model('ADMIN',adminSchema);
module.exports = Admin;