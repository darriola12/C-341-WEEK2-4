const route = require("express").Router();
const user = require("../controllers/recipe");
const validate = require("../util/recipeValidation");

// Ruta para obtener todas las recetas
route.get("/", user.getAllRecipes);

// Ruta para obtener una receta por ID
route.get("/:id", user.getRecipeById);

// Ruta para crear una nueva receta con validaciones
route.post("/", validate.createRecipeRules(), validate.validationCreate, user.createRecipe);

// Ruta para actualizar una receta existente
route.put("/:id", validate.createRecipeRules(), validate.validationCreate, user.updateRecipe);

// Ruta para eliminar una receta
route.delete("/:id", user.deleteRecipe);

module.exports = route;
