require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const engine = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressErrros.js");
// const { listingSchema , reviewSchema} = require("./schema.js");
// const Review = require("./models/reviews.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js")

const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local"); 

const secret = process.env.SECRET;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/listings"));

// these middlewares are used for parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // from postman etc

app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "public")));

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connection sucessful to mongoDB...")
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:secret
    },
    touchAfter:24*60*60,
})

store.on("error", (err)=>{
    console.log("error in session store ",err);
})

// const {reviewSchema} = require("./")
const sessionOptions = {
    store:store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // after 7 days session will expire
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


app.use(session(sessionOptions));
app.use(flash());

// authenctication using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "abc@gmail.com",
        username: "delta-student"
    })

    let regUser = await User.register(fakeUser, "helloworld");
    res.send(regUser);
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter)

// error handling middlewares that we delcared here
// All routes are completed then if other route send page not found
app.all("*", (req, res, next) => {
    // console.log(req.error);
    next(new ExpressError(404, "404 Page not found! ...."));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    try {
        res.render("../error.ejs", { message })
    }
    catch (err) {
        console.log("Could not opend the error.ejs ")
    }
});

app.listen("8000", () => {
    console.log("Port 8000 is listining....");
});
