var express                 = require("express");
var app                     = express();
var bodyParser              = require("body-parser");
var mongoose                = require("mongoose");
var flash                   = require("connect-flash");
var passport                = require("passport");
var LocalStrategy           = require("passport-local");
var methodOverride          = require("method-override");
var passportLocalMongoose   = require("passport-local-mongoose");
var expressSession          = require("express-session");
var Campground              = require("./models/campground");
var Comment                 = require("./models/comment");
var User                    = require("./models/user");
var seedDB                  = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes       = require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/happy_camping", { useNewUrlParser: true });
mongoose.connect("mongodb://mohammedmunna:munnal1234@ds115523.mlab.com:15523/happycamping", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "This line will be used for encoding and decoding",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Happy Camping Server has Started");
});

