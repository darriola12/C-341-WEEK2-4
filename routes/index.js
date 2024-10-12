const route = require("express").Router(); 
const recipes = require("./recipe");
const userController = require("../controllers/user");
const passport = require("passport");

route.get("/", (req, res) => {
    res.send("Hello World");
});

route.post("/register", userController.newUser);

route.use("/", require("./swagger")); 

// Rutas para las recetas
route.use("/recipes", recipes);


route.get("/login", passport.authenticate("github"), (req, res) => {})

route.get("logout", function(req, res, next){

    req.logOut(function(err){
        if(err){
            return next(err)
        }
        res.redirect("/")
    })
})

module.exports = route;
