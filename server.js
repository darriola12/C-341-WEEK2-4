const express = require("express");
const app = express();
const mongoDb = require("./database/index");
const route = require("./routes"); 
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session"); 
const GitHubStrategy = require("passport-github2").Strategy; 
const cors = require("cors");

const CALLBACK_URL = process.env.NODE_ENV === 'production'
  ? 'https://c-341-week2-4.onrender.com/github/callback'
  : 'http://localhost:3001/github/callback';

// Middleware para analizar el cuerpo de las peticiones
app.use(bodyParser.json())
   .use(session({
    secret: "secret",
    resave: false, 
    saveUninitialized: true
   }))
   .use(passport.initialize())
   .use(passport.session()) 
   .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    next();
   })
   .use(cors({ 
      origin: "*", 
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] 
   }))  // Un solo uso de cors es suficiente
   .use("/", route);


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Serializar y deserializar usuario
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});


app.get("/", (req, res) => {

    res.send(req.session.user !== undefined ? ` logged in as ${req.session.user.displayName} ` : "logged out")
})

app.get("/github/callback", passport.authenticate("github", {

    failureRedirect: "/api-docs", session: false}),
    (req, res) =>{
        req.session.user = req.user; 
        res.redirect("/")
    }
)

const PORT = process.env.PORT || 3001;

mongoDb.initDB((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    }
});
