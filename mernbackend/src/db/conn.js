const mongoose = require("mongoose");

//returns promise
mongoose.connect("mongodb://localhost:27017/loginpage",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
}).then(()=>{
    console.log("success");
}).catch((e)=>{
    console.log("No connections");
})