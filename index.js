import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import path from 'path';
import { fileURLToPath } from 'url';
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import localStrategy from "passport-local";
import User from "./models/userModel.js";

// fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// Routes
import listingRouter from "./routes/listingRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import userRouter from "./routes/userRouter.js";
import listing from "./models/listingModel.js"; // ✅ needed for root route query

// MongoDB connection
const dbURL = process.env.ATLAS_DB_URL;
async function main() {
  await mongoose.connect(dbURL);
}
main()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Session store
const mongoStore = MongoStore.create({
  mongoUrl: dbURL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});
mongoStore.on("error", (err) => {
  console.log("❌ Session store error:", err);
});

const sessionOptions = {
  store: mongoStore,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash + user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ✅ Root route → show listings/index.ejs
app.get("/", async (req, res) => {
  try {
    let listings = await listing.find({});
    res.render("listings/index.ejs", { listings });
  } catch (err) {
    res.status(500).send("Error loading listings");
  }
});

// Routers
app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/", userRouter);

// Error handler
app.use((error, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!" } = error;
  res.status(status).render("listings/error.ejs", { message });
});

// Server listen (Render needs process.env.PORT)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
