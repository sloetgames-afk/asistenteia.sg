// Importación de Firebase (Asegúrate de configurar tu consola)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Manejo de Pantallas
window.showScreen = (id) => {
    document.querySelectorAll('body > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
};

// Ajuste automático de altura del input
const userInput = document.getElementById('userInput');
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Lógica de Mensajes y Groq
let chatHistory = [];

async function sendMessage() {
    const text = userInput.value.trim();
    if(!text) return;

    appendBubble('user-bubble', text);
    userInput.value = "";
    userInput.style.height = 'auto'; // Resetear altura
    
    chatHistory.push({role: "user", content: text});

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ messages: chatHistory })
        });
        const data = await response.json();
        
        appendBubble('bot-bubble', data.content);
        chatHistory.push(data);
    } catch (e) {
        appendBubble('bot-bubble', "Error de conexión.");
    }
}

function appendBubble(clase, contenido) {
    const div = document.createElement('div');
    div.className = clase;
    div.innerText = contenido;
    const container = document.getElementById('chat-messages');
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

document.getElementById('btnSend').onclick = sendMessage;

// Estado de Auth
onAuthStateChanged(auth, (user) => {
    if (user) {
        showScreen('chat-app');
        document.getElementById('display-user-email').innerText = user.email;
    } else {
        showScreen('welcome-screen');
    }
});

// Funciones globales
window.logout = () => signOut(auth);
window.resetChat = () => {
    document.getElementById('chat-messages').innerHTML = "";
    chatHistory = [];
};
