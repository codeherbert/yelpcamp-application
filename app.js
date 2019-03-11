const express    = require("express"), 
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");
      
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP- will refactor later
const campgroundSchema = new mongoose.Schema ({
    name: String,
    image: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create(
    {
        name: "Granite Hill", 
        image: "https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg"
    }, function(err, campground){
        if (err) {
            console.log(err);
        }
            else {
                console.log("Newly Created Campground: ");
                console.log(campground);
            }
    });*/

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
             res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res) {
    //get data from form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const newCampground = {name: name, image:image};
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

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
});