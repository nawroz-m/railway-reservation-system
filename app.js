var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var Ticket = require("./models/printTicket");

//Connect mongoose to database
mongoose.connect('mongodb://localhost:27017/myapp', {useUnifiedTopology: true,
        useNewUrlParser: true,   useCreateIndex: true, useNewUrlParser: true});

//Schema Setup 
var mySchema = new mongoose.Schema({
   name: String,
   age: Number,
   from: String,
   to: String, 
   date: Date,
   persons: Number,
   created: {type: Date, default: Date.now}
   
});

var registerSchema = new mongoose.Schema({
    username: String,
    password: String,
    created: {type: Date, default: Date.now}
});

var Myapp = mongoose.model("Myapp", mySchema);//A Mongoose model is a wrapper on the Mongoose schema.
var registerModel = mongoose.model("registerModel", registerSchema);


// // create data 
// var george = new Myapp({
//   name: "George",
//   age: 23,
//   from: "Pune",
//   to: "Mumbai",
   
//   persons: 2
// });
// add to data base 
// george.save(function(err, info){
//   if(err){
//       console.log("SOMETHING WENT WRONG !!!");
//   } else{
//       console.log("WE JUST SAVE A PERSON INFO TO THE DATABASE !!");
//       console.log(info);
//   }
// });

// Myapp.find({}, function(err, info){
//   if(err){
//       console.log("SOMETHING WENT WRONG !");
//       console.log(err);
//   } else{
//       console.log("All the info here ");
//       console.log(info);
//   }
// });

var app = express()

app.use(require("express-session")({
    secret: "Hey be careful you are in secret pages",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));



app.set("view engine","ejs")

app.get("/",function(req, res){
    res.render("home");
});

app.get("/login",function(req, res){
    
    res.render("login");
    // LoginModel.find({}, function(err, login){
    //   if(err){
    //       console.log("ERRRORRRRRRRRRRRRRRRRRR!");
    //   } else{
    //         res.render("login", {login: login}); 
    //         console.log(login);
    //   }
    // });
   
});

//Middleware


// app.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                   failureRedirect: '/login',
//                                   failureFlash: true })
// );

app.post("/login",passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login",
        // failureFlash: true
    }), function(req, res){
        
});
 
// app.post("/login", function(req, res) {

//     res.redirect("/");    

//  });

app.get("/register", function(req, res) {
     User.find({}, function(err, register){
      if(err){
          console.log("ERRRORRRRRRRRRRRRRRRRRR!");
      } else{
            res.render("user", {register: register}); 
            
      }
    });
    
    //  res.render("user");
});

app.post("/register", function(req, res) {
    
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log("User already exist");
            return res.render("register");
        } else{
            passport.authenticate("local")(req, res, function(){
              res.redirect("/login"); 
            });
        }
    });
});



app.post("/ticket", function(req, res){
    res.send("You are in ticket pages");    
});


app.get("/bok", function(req, res) {
   res.render("bokticket"); 
});



app.get("/bok/pay", function(req, res) {
   res.render("checkout"); 
});



app.get("/paydone", function(req, res) {
   res.render("paydone"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("your server has ben started!!"); 
});

