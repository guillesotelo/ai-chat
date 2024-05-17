const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
// const { connection } = require("./api/db")
const routes = require("./api/routes")
const app = express()
const path = require('path')
const fs = require('fs')
const OpenAI = require("openai");
const dotenv = require('dotenv')
dotenv.config()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))
app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true, parameterLimit: 1000000 }));


app.use((err, _, res, __) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

app.get('/status', (_, res) => {
  res.status(200).send('CHAT-AI API [Status: OK]')
})

app.use("/api", routes)

const PORT = process.env.PORT || 5000

const buildPath = path.resolve(__dirname, 'build') || ''
const indexHtmlPath = buildPath ? path.resolve(buildPath, 'index.html') : ''
const indexExists = buildPath && indexHtmlPath && fs.existsSync(indexHtmlPath)

if (indexExists) {
  app.use(express.static('build'))
  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  })
}

// connection.on("error", console.error.bind("Connection error: ", console))

// connection.once("open", () => {
//   app.listen(PORT, () => console.log(`* Server listening on Port: ${PORT}... *`))
// })

app.listen(PORT, () => console.log(`* Server listening on Port: ${PORT}... *`))

module.exports = app