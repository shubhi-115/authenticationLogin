// require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose= require("mongoose");
const encrypt=require("mongoose-encryption");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
// const bcrypt=require("bcrypt");
// const saltRounds=10;
// const md5=require("md5");

const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// console.log(process.env.API_KEY);
app.use(session({
  secret: "OurlittleSecret.",
  resave:false,
  saveUninitialized: false
}));
mongoose.connect("mongodb+srv://admin-shubhi:shubhi123@cluster0.zhmsp.mongodb.net/userDB",{useUnifiedTopology: true},{useNewUrlParser: true});
mongoose.set(("useCreateIndex"),true);
//create schema of database
app.use(passport.initialize());
app.use(passport.session());
const userSchema= new mongoose.Schema({
  email: "String",
  password: "String"
});

// userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});
userSchema.plugin(passportLocalMongoose);

//create model of database
const User=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
  res.render("home");
})
//just three lines for serialize and deserialise cookie on browser and server respectively
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/secrets",function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/");
  }
});
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
})
app.post("/register",function(req,res){
User.register({username: req.body.username},req.body.password,function(err,user){
  if(err){
    console.log(err);
    res.redirect("/register");
  }else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/secrets");
    })
  }
})
});

app.post("/login",function(req,res){
  const user=new User({
    username: req.body.username,
    password: req.body.password
  })
  //initially md5(req.body.password)
  req.login(user,function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
  });
app.listen(3000,function(){
  console.log("server is running on port 3000");
})
