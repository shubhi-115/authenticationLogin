// require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose= require("mongoose");
const encrypt=require("mongoose-encryption");
const bcrypt=require("bcrypt");
const saltRounds=10;
// const md5=require("md5");

const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// console.log(process.env.API_KEY);
mongoose.connect("mongodb+srv://admin-shubhi:shubhi123@cluster0.zhmsp.mongodb.net/userDB",{useUnifiedTopology: true});
//create schema of database
const userSchema= new mongoose.Schema({
  email: "String",
  password: "String"
});

// userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});
//create model of database
const User=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
  res.render("home");
})
app.get("/register",function(req,res){
  res.render("register");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.post("/register",function(req,res){
  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser= new User({
      email: req.body.username,
      password: hash
    })
    newUser.save(function(err){
      if(!err){
          res.render("secrets");
      }
    });
  });
});

app.post("/login",function(req,res){
  const queryusername = req.body.username;
  const querypassword = req.body.password;//initially md5(req.body.password)
  User.findOne({email: queryusername},function(err,foundUser){
    if(foundUser){
      bcrypt.compare(querypassword,foundUser.password,function(err,result){
        if(result === true){
          res.render("secrets");
        }else{
          res.send("Invalid password");
        }
      });
    }
        else {
          console.log(err);}
      });
  });
app.listen(3000,function(){
  console.log("server is running on port 3000");
})
