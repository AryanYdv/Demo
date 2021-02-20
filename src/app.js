const express=require("express");
const jwt =require("jsonwebtoken");
const bcrypt= require("bcrypt");
const app=express();
require("./db/connection");
const Student=require("./models/students");
const User= require("./models/user");
const mongoose=require("mongoose");
const CheckAuth =require("../middleware/CheckAuth");
const port=process.env.PORT || 3000;
require("dotenv").config();
app.use(express.json());


// for getting data
app.get("/get", async(req,res)=>{
    try{
   const student = await Student.find()
   res.json(student)
    }
    catch(err){
       res.send("error", +err);
    }
});

 // for usersignup rote
app.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
      .exec()
      .then(user => {
          if (user.length >= 1) {
              return res.status(409).json({
                  message: "Mailid exist already"
              });

          } else {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                  if (err) {
                      return res.status(500).json({
                          error: err
                      });
                  } else {
                      const user = new User({
                          _id: new mongoose.Types.ObjectId(),
                          email: req.body.email,
                          password: hash

                      });
                      user
                          .save()
                          .then(result => {
                              console.log(result)
                              res.status(201).json({
                                  message: 'user created'
                              });
                          })
                          .catch(err => {
                              console.log(err)
                              res.status(500).json({
                                  error: err
                              })
                          });
                  }

              });
          }
      })

});
 

// for making user autherized
app.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
      .exec()
      .then(user => {
          if (user.length < 1) {
              return res.status(401).json({
                  message: "Auth Failed"
              })
          }
          bcrypt.compare(req.body.password, user[0].password, (err, result) => {
              if (err) {
                  return res.status(401).json({
                      message: "Auth Failed"
                  });
              }

              if (result) {
                  const token = jwt.sign({
                          email: user[0].email,
                          userId: user[0].userId
                      },
                      process.env.JWT_KEY, {
                          expiresIn: "1h"
                      }

                  );
                  return res.status(200).json({
                      message: "Auth Successfull",
                      token: token
                  });
              }
              res.status(401).json({
                  message: "Auth Failed"

              });
          });
      })
      .catch(err => {
          console.log(err)
          res.status(500).json({
              error: err
          });
      });
});

 // posting data
app.post("/students",CheckAuth,(req,res)=>{
      console.log(req.body);
      const user= new Student(req.body);
      user.save().then(()=>{
          res.status(201).send(user);
      }).catch((e)=>{
         res.status(400).send(e);
      })
  
    });
    
  //updating data
app.put('/:id', (req, res, next) => {
    const student = {
      _id: req.params.id,
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      phoneNu: req.body.phoneNu,
      address: req.body.address

    };
    Student.updateOne({_id: req.params.id}, student, {new: true}).then(
      () => {
        res.status(201).json({
          message: 'student data updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

  //deleting required data
 app.delete("/:id", (req,res)=>{
    const user= Student.findByIdAndRemove(req.params.id)
    user.studetnId=req.body.studentId;
    const a1=user.remove().then(()=>{
       res.json("deleted succefully!")
    }).catch((e)=>{
        res.send(e);
    })
})




app.listen(port,()=>{
    console.log("My app is running!");
});