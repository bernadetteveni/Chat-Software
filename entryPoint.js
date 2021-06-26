import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.SECRET);

import express from "express";
import { urlencoded } from 'body-parser';
import ejs from "ejs";
import session from 'express-session'
import passport from 'passport'
import passportLocalMongoose from 'passport-local-mongoose'

const app = express();
const port = 3000;
app.listen(port, ()=>{
    console.log("Server is running on port" + port)
})

app.use(urlencoded({extended:true}));
app.use(express.static("public", {index: false}))

// set up session
app.use(session({
    secret: process.env.SECRET, // stores our secret in our .env file
    resave: false,              // other config settings explained in the docs
    saveUninitialized: false
}));

// set up passport
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

//set up mongoose

import mongoose from 'mongoose';

await mongoose.connect("mongodb://localhost/chatDB",
    {useNewUrlParser: true,
    useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema);

// more passport-local-mongoose config
// create a strategy for storing users with Passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const messageSchema = new mongoose.Schema ({
    id: Number,
    name: String,
    creator: userSchema
})

const Message = mongoose.model("Message", messageSchema);

app.get("/", function(req, res){
    res.render("login")
});

// register route
app.post("/register", function(req, res) {
    console.log("Registering a new user");
    // calls a passport-local-mongoose function for registering new users
    // expect an error if the user already exists!
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.redirect("/")
        } else {
            // authenticate using passport-local
            // what is this double function syntax?! It's called currying.
            passport.authenticate("local")(req, res, function(){
                res.redirect("/chat")
            });
        }
    });
});

// login route
app.post("/login", function(req, res) {
    console.log("A user is logging in")
    // create a user
    const user = new User ({
        username: req.body.username,
        password: req.body.password
     });
     // try to log them in
    req.login (user, function(err) {
        if (err) {
            // failure
            console.log(err);
            res.redirect("/")
        } else {
            // success
            // authenticate using passport-local
            passport.authenticate("local")(req, res, function() {
                res.redirect("/chat"); 
            });
        }
    });
});

// show the chat page
app.get("/chat", function(req, res){
    console.log("A user is accessing chat")
    if (req.isAuthenticated()) {
        console.log(req.user.username)
        var username = req.user.username;
        Message.find({}, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                var results = [];
                var listOfMessages = results;
                var largestMessageId = 20;
                res.render("chat", {
                    username: username,
                    largestMessageId: largestMessageId,
                    listOfMessages: listOfMessages
                });
            }
        });
    } else {
        res.redirect("/");
    }
});

app.post("/addChat", async(req, res)=>{
    var user
    await User.find({username: req.body.usernameId}, (err, results)=>{
        if(err){
            console.log(err)
        }
        else{
            user = results[0]
        }
    })

    console.log(req.body.usernameId);
    console.log("req.body.id", req.body.id);
   
    var messageName = req.body.messageInput;
    const message = new Message({
        "name": messageName,
        "creator": user
    })

    await message.save()

    await Task.updateOne( {"_id": mongoose.Types.ObjectId(req.body.id)}, function(err){
        if (err) {
            console.log(err);
        }
        else{
            res.redirect("/chat");
        }
    })
    res.redirect("/chat");
});

// logout
app.get("/logout", function(req, res){
    console.log("A user logged out")
    req.logout();
    res.redirect("/");
});
