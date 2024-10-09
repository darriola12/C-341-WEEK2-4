const express = require("express");
const app = express();
const mongoDb = require("./database/index");
const route = require("./routes"); 
const bodyParser = require("body-parser");




// Middleware para analizar el cuerpo de las peticiones
app.use(bodyParser.json());

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Manejar las solicitudes OPTIONS
    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // No Content
    }
    
    next();
});


// Root route
app.use("/", route);

// Port on which the application will run
const PORT = process.env.PORT || 3001;

// Initialize the database and start the server
mongoDb.initDB((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    }
});