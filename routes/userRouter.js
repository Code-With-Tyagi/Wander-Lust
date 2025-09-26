import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import * as userController from "../controllers/userController.js";

router.get("/signup", userController.signupForm);

router.post("/signup", wrapAsync(userController.signUpUser));

router.get("/login", userController.loginForm)

router.post("/login",saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userController.loginUser);

router.get("/logout",userController.logoutUser);


export default router;


