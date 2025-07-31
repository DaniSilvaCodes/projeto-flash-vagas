const express = require('express')
const cors = require('cors')

// inicializando o express 
const app = express()

// Config JSON resposta
app.use(express.json())

// Resolver CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// pasta pública para imagens
app.use(express.static('public'))

// const path = require('path')
// app.use('/imagens', express.static(path.join(__dirname, 'public/images')))


//Importações para rotas
const UserRoutes = require('./routes/UserRoutes')
const ServiceRoutes = require('./routes/ServiceRoutes')


// Rotas
app.use('/users', UserRoutes)
app.use('/services', ServiceRoutes)






app.listen(5000)