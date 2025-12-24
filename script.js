// Abrir/Cerrar Menú
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Abrir Configuración
function openConfig() {
    document.getElementById('configModal').style.display = 'flex';
}

function closeConfig() {
    document.getElementById('configModal').style.display = 'none';
}

// Cambiar Tema
function changeTheme(theme) {
    document.body.className = theme + '-theme';
}

// Lógica de Envío de Mensajes
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chat-box');

sendBtn.onclick = () => {
    if(userInput.value.trim() !== "") {
        // Crear mensaje del usuario
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg user';
        msgDiv.textContent = userInput.value;
        chatBox.appendChild(msgDiv);
        
        // Limpiar input y scroll
        userInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Aquí conectarías con Firebase y la API de Chat
    }
};
// 2. Cambio de Tema (Local)
const themeSelector = document.getElementById('theme-selector');
themeSelector.addEventListener('change', (e) => {
    document.body.className = e.target.value === 'dark' ? 'dark-theme' : 'light-theme';
});
