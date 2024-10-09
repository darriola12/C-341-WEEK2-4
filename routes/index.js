const route = require("express").Router(); 
const recipes = require("./recipe")

route.get("/", (req, res) => {
    res.send("Hello World");
});

route.use("/", require("./swagger")); 


route.use("/recipes", recipes);

module.exports = route;