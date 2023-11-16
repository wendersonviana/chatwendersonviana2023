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

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content, image } = JSON.parse(data);

    if (image) {
        const isOwnMessage = userId === user.id;
        const messageContent = isOwnMessage ? "" : ``;

        const message = isOwnMessage
            ? createMessageSelfElement(messageContent)
            : createMessageOtherElement(messageContent, userName, userColor);

        const imageElement = document.createElement("img");
        imageElement.src = image;
        imageElement.alt = "Imagem recebida";
        message.appendChild(imageElement);

        message.classList.add("message--image");
        chatMessages.appendChild(message);
    } else if (content) {
        const message =
            userId == user.id
                ? createMessageSelfElement(content)
                : createMessageOtherElement(content, userName, userColor);

        chatMessages.appendChild(message);
    }

    scrollScreen();
};

const handleLogin = (event) => {  // quando fizer o login
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value  // vai atualizar o usuario
    user.color = getRandomColor()

    login.style.display = "none"  // mostrar o chat
    chat.style.display = "flex"

    websocket = new WebSocket("wss://chat-backend-2vm4.onrender.com") // e criar um conexão
    websocket.onmessage = processMessage

}

const sendMessage = (event) => {
    event.preventDefault();

    const content = chatInput.value;
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    // if(content || file) { 
    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: content,
        image: null,
    };

    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            message.image = reader.result;
            websocket.send(JSON.stringify(message));
        };
        reader.readAsDataURL(file);
    } else {
        websocket.send(JSON.stringify(message));
    }

    chatInput.value = "";
    fileInput.value = ""; // Limpe o input de arquivo após o envio
// }
};

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
