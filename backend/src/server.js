const { WebSocketServer } = require("ws")
const dotenv = require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 }) // vai tentar procurar a tag PORT ou vai definir 8080

wss.on("connection", (ws) => {
    ws.on("error", console.error)

    ws.send("Mensagem enviada pelo servidor! ")

    ws.on("message", (data) => {  
        wss.clients.forEach((client) => client.send(data.toString())) // pega todos os clientes que estão conectados e repassa a mesma mensagem
    })

    console.log("client connected")
})