const socket = io("http://localhost:3000", {})

const clientsTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  sendMessage()
})

const messageTone = new Audio('/tone.mp3')

socket.on("client-total", (data) => {
  clientsTotal.innerText = `Total clients: ${data}`
})

socket.on("message", (data) => {
  console.log(data)
  messageTone.Play()
  addMessageToUI(false, data);
})

socket.on("feedback", (data) => {
  console.log(data)
  clearFeedback()
  const element =
    `<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
  </li>`
  messageContainer.innerHTML += element
})

function clearFeedback() {
  document.querySelectorAll(`li.message-feedback`).forEach(element => {
    element.parentNode.removeChild(element)
  })
}

function sendMessage(e) {
  if (messageInput.value) {
    const data = {
      name: nameInput.value,
      message: messageInput.value,
      dateTime: new Date(),
    }
    socket.emit('message', data)
    addMessageToUI(true, data);
    messageInput.value = ""
  }
}

function addMessageToUI(isOwnMessage, data) {
  clearFeedback()
  const element =
    `<li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
      ${data.message}
    <span> ${data.name}  ● ${moment(data.dateTime).fromNow()}</span>
    </p>
  </li>`

  messageContainer.innerHTML += element
  scrollToBottom()
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    'feedback': `✍️ ${nameInput.value} is typing a message...`
  })
})

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    'feedback': `✍️ ${nameInput.value} is typing a message...`
  })
})

messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    'feedback': ""
  })
})