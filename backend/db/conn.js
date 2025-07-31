const mongoose = require('mongoose')

//Conectando ao banco
async function main(){
    await mongoose.connect('mongodb://localhost:27017/fastvaga')
    console.log("Conectou ao Mongoose")
}

main().catch((err) => console.log(err) )// ser der erro, imprimir

module.exports = mongoose