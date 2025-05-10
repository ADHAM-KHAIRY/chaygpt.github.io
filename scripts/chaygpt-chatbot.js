const style = document.createElement("style");
style.innerHTML = `
    .chat-toggle {
        position: fixed;
        z-index: 99999;
        bottom: 20px;
        right: 20px;
        background-color: #4a563a;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
    }
    .chat-popup {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 300px;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        border-radius: 10px;
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 10000;
    }
    .chat-header {
        background-color: #4a563a;
        color: #d8e0cc;
        padding: 10px;
        display: flex;
        justify-content: space-between;
    }
    .chat-body {
        padding: 10px;
        height: 200px;
        overflow-y: auto;
        background-color: #f7f7f7;
    }
    .chat-input {
        display: flex;
        border-top: 1px solid #ccc;
    }
    .chat-input input {
        flex: 1;
        padding: 10px;
        border: none;
    }
    .chat-input button {
        background-color: #4a563a;
        color: white;
        padding: 10px;
        border: none;
        cursor: pointer;
    }
    .message {
        margin: 5px 0;
        padding: 8px 12px;
        border-radius: 15px;
        max-width: 80%;
    }
    .message.bot {
        background-color: #eee;
        align-self: flex-start;
    }
    .message.user {
        background-color: #d1e7dd;
        align-self: flex-end;
        margin-left: auto;
    }
    .closebutton {
        color: #d8e0cc;
        background-color: #4a563a;
        border: none;
    }
`;
document.head.appendChild(style);

//  HTML
const chatHTML = `
    <button class="chat-toggle" onclick="toggleChat()">Chat with ChayGPT</button>
    <div id="chatPopup" class="chat-popup">
        <div class="chat-header">
            <span>ChayGPT Support</span>
            <button onclick="toggleChat()" class="closebutton">X</button>
        </div>
        <div class="chat-body" id="chatBody">
            <div class="message bot">Hello! How can I help you today?</div>
        </div>
        <div class="chat-input">
            <input type="text" id="userInput" placeholder="Type a message..." />
            <button onclick="sendMessage()">Send</button>
        </div>
    </div>
`;
document.body.insertAdjacentHTML("beforeend", chatHTML);

//  JavaScript functions
window.toggleChat = function () {
    const chat = document.getElementById("chatPopup");
    chat.style.display = chat.style.display === "flex" ? "none" : "flex";
    chat.scrollTop = chat.scrollHeight;
};

window.sendMessage = function () {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    const chatBody = document.getElementById("chatBody");

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = message;
    chatBody.appendChild(userMsg);


    input.value = "";

    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    botMsg.textContent = "Thanks for your message!\n We'll get back to you soon.";
    chatBody.appendChild(botMsg);

    
    chatBody.scrollTop = chatBody.scrollHeight;
};
