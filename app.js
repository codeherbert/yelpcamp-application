const express    = require("express"), 
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      passport   = require("passport"),
      LocalStrategy = require("passport-local"),
      User       = require("./models/user"),
      Campground = require("./models/campground"),
      Comment    = require("./models/comment"),
      seedDB     = require("./seeds");
      
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIGURATION

app.use(require("express-session")( {
    secret: "Webdevbootcamp is pure awesomeness!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
             res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res) {
    //get data from form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newCampground = {name: name, image:image, description: desc};
    // Create a new Campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
            }   else {
                //redirect back to campgrounds page
                res.redirect("/campgrounds");
            }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }   else {
            console.log(foundCampground);
            // render show template with that campground
                res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// =========================
// COMMENTS ROUTES
// =========================

app.get("/campgrounds/:id/comments/new", function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }   else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments", function (req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }   else {
                Comment.create(req.body.comment, function (err, comment) {
                    if (err) {
                        console.log(err);
                    }
                        else {
                            campground.comments.push(comment);
                            campground.save();
                            res.redirect("/campgrounds/" + campground._id);
                        }
                });
                //Comment.create({})
            }
    });
    //create new comment
    //connect new comment to campground
    //redirect to campground show page
});

// ==========
// AUTH ROUTES
// ==========

// show register form
app.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res) {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res) {
    res.render("login");
});
//handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req, res) {
        
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
});