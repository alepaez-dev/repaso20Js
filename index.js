require("dotenv").config()
const express = require("express")
const cors = require('cors')
const fs = require("fs") // con callback
const fsPromise = require("fs/promises") // promesas
const mongoose = require("mongoose")

console.log("process env", process.env)
/**
 * 
 * 1 - Callbacks
 * 2 - Promises
 * 
 *     Que aprendimos a promesas
 *     - a. Como hacerlas
 *     - b. Como leerlas, ejecutarlas
 * 
 *          a . then y catch
 *          b . async y await
 * 
 */


// Nuesta app
const app = express()

// Middleware
app.use(cors()) // Todo el mundop tiene acceso
app.use(express.json())


const koderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  edad: {
    type: Number
  },
  modulo: {
    type: String
  },
  generacion: {
    type: String,
    required: true
  }
})

const Koder = mongoose.model("koders", koderSchema)

// Ruta, metodo
// http://localhost:8080/
// Todo lo que el cliente envia -> request
// Cliente -> Insonmia, Frontend, otraAPI, -> request
// EL servidor(nosotros) responsemos -> response
app.post("/", (req, res) => {
  // Req -> request
  // Res -> response
  // Toda mi logica

  // Destructurar
  // declaracion de vatiable -> { la variable } -> de donde la vas a sacar
  const { body } = req
  // Content-Type -> application/json
  fs.writeFile(body.fileName, body.data, "utf8", (error) => {

    // si hay error
    if(error) {
      throw error // Fin
    } 

    // Si no
    res.json({ message: `El archivo ${body.fileName} fue creado y escrito exitosamente` })
  })
})

// Path params
// recursos/identificador
app.get("/koders/:id", async (request, response) => {
  const { params } = request

  try {
    const koder = await Koder.findById(params.id)
    let status = 200
    let success = true
    let data = {
      koder: koder
    }

    // Si el koder no fue encontrado
    if(!koder) {
      success = false
      status = 404
      data = { message: "Koder not found" }
    }

    response.status(status)
    response.json({
      success,
      data
    })
  } catch(error) {
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
  
  
 
})

// filtrart koders
// Query params
app.get("/koders", async (request, response) => {
  const { query } = request

  console.log("modulo", query.modulo)
  // Accedido
  const bd = await fsPromise.readFile("koders.json", "utf8")
  const parsedDB = JSON.parse(bd)
  // Filtrar
  const kodersEncontrados = parsedDB.koders.filter((koder) => koder.modulo === query.modulo)

  response.json({
    success: true,
    data: {
      koders: kodersEncontrados
    }
  })
 
})

// Then y catch
// Async await

// Schemas
// Modelos

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
.then(() => {
  console.log("Base de datos conectada")
  app.listen(8080, () => {
    console.log("El servidor esta escuchando ...")
  })
  
})
.catch((error) => {
  console.log("error", error)
})