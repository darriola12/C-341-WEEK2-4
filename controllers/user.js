const mongoDb = require("../database/index");
const bcrypt = require("bcrypt");

const newUser = async (req, res) => {
  try {
    const { userPassword, userName, userLastname, userEmail } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = {
      userName,
      userLastname,
      userEmail,
      userPassword: hashedPassword,
    };

    const response = await mongoDb
      .getDatabase()
      .collection("Users")
      .insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({
        message: "Usuario creado exitosamente",
      });
    } else {
      res.status(500).json({ error: "Ocurrió un error al insertar los datos" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Ocurrió un error" });
  }
};


module.exports = {newUser}