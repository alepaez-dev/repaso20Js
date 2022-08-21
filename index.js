const express = require("express")
const fs = require("fs") // con callback
const fsPromise = require("fs/promises") // promesas

// Nuesta app
const app = express()

// Middleware
app.use(express.json())

app.listen(8080, () => {
  console.log("El servidor esta escuchando ..")
})

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
app.get("/koders/:id", (request, response) => {
  const { params } = request

  // Acceder a la bd -> FileSystem API
  fsPromise.readFile("koders.json", "utf8")
  .then((bd) => {
    console.log("tipo de dato de id", typeof params.id)
    // Parseabamos
    const parsedDB = JSON.parse(bd)

    // FindIndex
    const koderIndex = parsedDB.koders.findIndex((koder) => koder.id === Number(params.id))

    response.json({
      success: true,
      data: {
        koder: parsedDB.koders[koderIndex]
      }
    })
  })
  .catch((error) => {
    console.log("error", error)
  })
})

// Then y catch
// Async await