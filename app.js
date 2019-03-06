const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const campgrounds = [
        {name: "Clifty Creek", image: "https://farm2.staticflickr.com/1832/42962226542_cf23d7050f.jpg"},
        {name: "Granite Hill", image: "https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg"},
        {name: "Mountain Springs Rest", image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg"}
    ];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    //get data from form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const newCampground = {name: name, image:image};
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
});