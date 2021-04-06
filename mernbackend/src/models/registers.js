const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");

//defining schema and validators
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    email: {
        type: String, required: true, unique: [true, "Email already Present"],
        validate(value) { if (!validator.isEmail(value)) { throw new Error("Enter valid Email"); } }},
    password: { type: String, required: true, minlength: 3 },
    confirmpassword: { type: String, required: true, minlength: 3 },
    tokens:[{
        token:{
            type: String, required: true
        }
    }]
});

userSchema.methods.generatetoken=async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(error){
        res.send(error);
    }
}


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10);
    this.confirmpassword=await bcrypt.hash(this.password,10);
}
next();
})
//defing collections
const User=new mongoose.model('user',userSchema);
module.exports =User;