import User from "../models/userModel.js"
export const signupForm =(req, res) => {
    res.render("../views/users/signup.ejs");
}

export const signUpUser=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        // this is done to automaticaaly login after user signup
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
        })

    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

export const loginForm=(req, res) => {
    res.render("../views/users/login.ejs");
};

export const loginUser=(req, res) => {
    req.flash("success", "Welcome back to Wander Lust!");

    let redirectUrl=res.locals.redirectUrl||"/listings" // this line is to write becoz when we directly login then isloggedin middleware doesnot trigger and redirectUrl will be empty so that shows an error page not found 
    res.redirect(redirectUrl);
};

export const logoutUser=(req, res, next) => {
    // this method is used to logout the widow
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};