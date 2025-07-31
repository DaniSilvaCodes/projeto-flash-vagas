const jwt = require("jsonwebtoken")

// Criando Token
const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "nossosecret")

    // Retornando Token
    res.status(200).json({
        message: "Você está autenticado",
        token: token,
        userId: user._id,
    })
}

module.exports = createUserToken
