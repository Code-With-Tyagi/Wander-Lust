import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import path from 'path';
import ExpressError from "./utils/ExpressError.js";
import { fileURLToPath } from 'url';
import session from "express-session";
import MongoStore from "connect-mongo"; // used to store session related information at production level
import flash from "connect-flash";
import passport from "passport";
import localStrategy from "passport-local";
import User from "./models/userModel.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let app = express();
app.listen(3000, () => {
    console.log("Server is Listening");
})
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// importing the routes for listing and reviews and users
import listingRouter from "./routes/listingRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import userRouter from "./routes/userRouter.js";

const dbURL=process.env.ATLAS_DB_URL;
console.log(dbURL);
async function main() {
    await mongoose.connect(dbURL);
}
main()
    .then(() => {
        console.log("connection established sucessfully");
    })
    .catch((err) => {
        console.log(err);
    });

const mongoStore=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600, // used to ensure that session information is saved if there is no interaction with server
})

mongoStore.on("error",()=>{
    console.log("error in mongo session store",err);
})

const sessionOptions={
    store:mongoStore,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // Initialize Passport middleware
app.use(passport.session()); // Enable persistent login sessions

passport.use(new localStrategy(User.authenticate())); // Use local strategy for username/password login

passport.serializeUser(User.serializeUser()); // Store user ID in session after login
passport.deserializeUser(User.deserializeUser()); // Retrieve full user from ID stored in session




// MIDDLEWARE FOR STORING THE ERROR AND SUCCESS MESSAGES IN RES.LOCALS
app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); // storing flash message in res.locals to access it in ejs files
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user; // saving the current logged in user
    next();
})


// using the listings and reviews routes
app.use("/listings",listingRouter);
app.use("/listings",reviewRouter);
app.use("/",userRouter);

// Error Handling Route
app.use((error, req, res, next) => {
    let { status = 500, message = "Something Went Wrong!" } = error;
    res.status(status).render("listings/error.ejs", { message });
})



