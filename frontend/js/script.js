//login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

//chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")


const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket 

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content

    return div // return pra conseguir usar em outros lugares 
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")

    div.classList.add("message--self")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div // return pra conseguir usar em outros lugares 
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {      // scroll automatico
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth" // deixar o scroll suave
    })
}

const processMessage =  ({ data }) => {
    const { userId, userName, userColor, content} = JSON.parse(data)

    const message = 
        userId == user.id 
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen() // sempre que receber mensagem, vai executar essa função
}

const handleLogin = (event) => {  // quando fizer o login
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value  // vai atualizar o usuario
    user.color = getRandomColor()

    login.style.display = "none"  // mostrar o chat
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8000") // e criar um conexão
    websocket.onmessage = processMessage

}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message)) // transformar em uma string

    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
