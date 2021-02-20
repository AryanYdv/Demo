const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://aryanydv281:Aryan@123@cluster0.dmeot.mongodb.net/student",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{                                 //promises
  console.log("connection is successfull");
}).catch(()=>{                                //promises
    console.log("no connection!");
});

