const mongoDb = require("../database/index");
const { ObjectId } = require("mongodb");

// Obtener todas las recetas
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await mongoDb.getDatabase().collection("recipes").find().toArray();
        console.log(recipes);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener una receta por ID
const getRecipeById = async (req, res) => {
    try {
        const recipeId = new ObjectId(req.params.id);
        const recipe = await mongoDb.getDatabase().collection("recipes").findOne({ _id: recipeId });
        
        if (!recipe) {
            return res.status(404).json({ message: "Receta no encontrada" });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Crear una nueva receta
const createRecipe = async (req, res) => {
    const newRecipe = {
        recipe: req.body.recipe,
        ingredients: req.body.ingredients,
        time: req.body.time,
        preparation: req.body.preparation,
        country: req.body.country
    };

    try {
        const response = await mongoDb.getDatabase().collection("recipes").insertOne(newRecipe);

        if (response.acknowledged) {
            res.status(201).json({
                message: "Receta creada exitosamente",
                recipeId: response.insertedId
            });
        } else {
            res.status(500).json({ error: "Ocurrió un error al insertar los datos" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

// Actualizar una receta
const updateRecipe = async (req, res) => {
    const recipeId = new ObjectId(req.params.id);
    const updatedRecipe = {
        recipe: req.body.recipe,
        ingredients: req.body.ingredients,
        time: req.body.time,
        preparation: req.body.preparation,
        country: req.body.country
    };

    try {
        const response = await mongoDb.getDatabase().collection("recipes").replaceOne(
            { _id: recipeId },
            updatedRecipe
        );

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Receta actualizada exitosamente", recipeId });
        } else {
            res.status(404).json({ error: "Receta no encontrada o no se realizaron cambios" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

// Eliminar una receta
const deleteRecipe = async (req, res) => {
    const recipeId = new ObjectId(req.params.id);

    try {
        const response = await mongoDb.getDatabase().collection("recipes").deleteOne({ _id: recipeId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Receta eliminada exitosamente", recipeId });
        } else {
            res.status(404).json({ error: "Receta no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

module.exports = { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };
