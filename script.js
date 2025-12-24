import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Tu configuración real de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCLpi9-IwaceN0i3cZkn5VGLJX9MRfaOo0",
    authDomain: "sg-asistente.firebaseapp.com",
    databaseURL: "https://sg-asistente-default-rtdb.firebaseio.com",
    projectId: "sg-asistente",
    storageBucket: "sg-asistente.firebasestorage.app",
    messagingSenderId: "118262525208",
    appId: "1:118262525208:web:7f586b62b5ec4da351026d",
    measurementId: "G-R2B6S25786"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- NAVEGACIÓN Y PANTALLAS ---
window.showScreen = (id) => {
    document.querySelectorAll('body > div, main').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
};

// --- AUTENTICACIÓN ---
const btnRegister = document.getElementById('btnRegister');
if (btnRegister) {
    btnRegister.onclick = async () => {
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        if (pass !== confirm) return alert("Las contraseñas no coinciden");
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
        } catch (e) { alert("Error: " + e.message); }
    };
}

const btnLogin = document.getElementById('btnLogin');
if (btnLogin) {
    btnLogin.onclick = async () => {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (e) { alert("Error: Usuario o contraseña incorrectos"); }
    };
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        showScreen('chat-app');
        document.getElementById('display-user-email').innerText = user.email;
    } else {
        showScreen('welcome-screen');
    }
});

window.logout = () => signOut(auth);

window.deleteAccount = async () => {
    if (confirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.")) {
        try {
            await deleteUser(auth.currentUser);
        } catch (e) { alert("Para eliminar la cuenta, debes haber iniciado sesión recientemente."); }
    }
};

// --- CHAT Y GROQ ---
let chatHistory = [];
const userInput = document.getElementById('userInput');

if (userInput) {
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

async function sendMessage() {
    const text = userInput.value.trim();
    if(!text) return;

    // Crear chat visual si es el primer mensaje
    if(chatHistory.length === 0) {
        const historyContainer = document.getElementById('history-container');
        const item = document.createElement('div');
        item.className = "history-item";
        item.innerText = text.substring(0, 20) + "...";
        historyContainer.appendChild(item);
    }

    appendBubble('user-bubble', text);
    userInput.value = "";
    userInput.style.height = 'auto'; 
    
    // Obtener idioma seleccionado
    const botLang = document.getElementById('lang-selector')?.value || "Español";
    const systemPrompt = { role: "system", content: `Responde siempre en idioma: ${botLang}` };
    
    chatHistory.push({role: "user", content: text});

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ messages: [systemPrompt, ...chatHistory] })
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

// --- CONFIGURACIÓN Y MENÚ ---
window.toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('active');
};

window.openSettings = () => {
    document.getElementById('config-modal').classList.remove('hidden');
};

window.closeSettings = () => {
    document.getElementById('config-modal').classList.add('hidden');
};

window.changeTheme = (theme) => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
};

window.resetChat = () => {
    document.getElementById('chat-messages').innerHTML = "";
    chatHistory = [];
    if(window.innerWidth < 768) toggleSidebar();
};
