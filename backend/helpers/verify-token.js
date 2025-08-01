const jwt = require('jsonwebtoken')
const getToken = require('./get-token')


//middleware para validar token
const checkToken = (req, res, next) =>{

    if(!req.headers.authorization){
        return res.status(401).json({messege: 'Acesso negado!'})
    }

    const token = getToken(req)

    if(!token){
        return res.status(401).json({messege: 'Acesso negado!'})
    }

    try{
        const verified = jwt.verify(token, 'nossosecret')
        req.user = verified
        next()
    }catch(error){
        return res.status(400).json({messege: 'Token invalido!'})
    }
}   

module.exports = checkToken