const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let messageHistory = [];

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // Agregar mensaje usuario a la pantalla
    appendMessage('user', text);
    userInput.value = '';
    
    messageHistory.push({ role: "user", content: text });

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messageHistory })
        });
        
        const data = await response.json();
        const botText = data.choices[0].message.content;
        
        appendMessage('bot', botText);
        messageHistory.push({ role: "assistant", content: botText });
    } catch (e) {
        appendMessage('bot', "Error al conectar con Groq.");
    }
}

function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `msg ${role}-msg`;
    div.innerText = (role === 'user' ? 'Tú: ' : 'AI: ') + text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', handleSend);
