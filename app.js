if(process.env.NODE_ENV!="Production"){
    require("dotenv").config();
}


const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const passport=require("passport");
const Users=require("./model/sign.js");
const localStrategy=require("passport-local");
const session=require("express-session");
const flash=require("connect-flash");
const MongoStore = require("connect-mongo");
const dburl="mongodb+srv://Blog:5BSaLmjItgMmzY7Y@cluster0.b6sat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.set("views",path.join(__dirname,"view"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

main().
    then(() => {
        console.log("connection successful");
    }).catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dburl);
}

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo store",err);
});

const sessionOption = ({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:Date.now()*24*60,
})

app.use(session(sessionOption));
app.use(flash());



// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
// })
//passport setting
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


app.get("/",(req,res)=>{
    res.send("working");
})

app.get("/sign",(req,res)=>{
    res.render("index.ejs",{msg:req.flash("success")});
})

app.post("/sign",async(req,res)=>{
    let {username,email,password}=req.body;
    const newusers= new Users({email,username});
    const regist=await Users.register(newusers,password);
    req.flash("success","successful register");
    console.log(regist);
    res.redirect("/sign");
    // console.log(username);
})

// })
// app.get("/demo",async(req,res)=>{
//         let fakeuser=new Users({
//             email:"aditya@gmail.com",
//             username:"Aaditya12345"
//         });
//        let registernew=await Users.register(fakeuser,"helloworld");
//        console.log(registernew);
//        res.send("working");
//     })


app.listen(8080,(req,res)=>{
    console.log("server working");
});
