const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    const campgrounds = [
        {name: "Clifty Creek", image: "https://farm2.staticflickr.com/1832/42962226542_cf23d7050f.jpg"},
        {name: "Granite Hill", image: "https://pixabay.com/get/eb30b00d21f0053ed1584d05fb1d4e97e07ee3d21cac104490f1c470a6eeb3b9_340.jpg"},
        {name: "Mountain Springs Rest", image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg"}
    ];
    res.render("campgrounds", {campgrounds: campgrounds});
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
});