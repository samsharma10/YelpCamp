const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  middleware = require("../middleware");

//INDEX -show all campgrounds
router.get("/", (req, res) => {
  //get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user
      });
    }
  });
});

//CREATE - add new campground toDB
router.post("/",middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: image, description: desc, author: author };

  //create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
  //find the campground with provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id,(err,foundCampground)=>{
    res.render("campgrounds/edit",{campground:foundCampground});
  });
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground,(err, updatedCampground)=>{
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/"+ req.params.id);
    }
  });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,(req,res)=>{
  Campground.findByIdAndRemove(req.params.id,(err)=>{
if(err){
  res.redirect("/campgrounds");
}else{
  res.redirect("/campgrounds");
}
  });
});


module.exports = router;
