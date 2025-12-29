/* ============================================================
   LYRA AI CORE LOGIC
   v2.0.0-pro
   ============================================================ */

// --- CONFIGURATION ---
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyD...", // Reemplaza con tus credenciales reales si las tienes
    authDomain: "lyra-ai-pro.firebaseapp.com",
    projectId: "lyra-ai-pro",
    storageBucket: "lyra-ai-pro.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const GROQ_API_KEY = "gsk_..."; // TU API KEY AQUI
const SYSTEM_PROMPT = "Eres Lyra, una IA avanzada, profesional y empática. Responde en Markdown. Sé concisa pero útil.";

// --- STATE MANAGEMENT ---
const AppState = {
    currentUser: null,
    currentChatId: null,
    messages: [],
    isTyping: false,
    theme: 'dark'
};

// --- DOM ELEMENTS ---
const el = (id) => document.getElementById(id);

// --- INITIALIZATION ---
let app, auth, db;
try {
    app = firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth();
    db = firebase.firestore();
} catch (e) {
    console.warn("Firebase not configured (Demo Mode)");
}

// --- CORE FUNCTIONS ---

// 1. Chat Logic
async function sendMessage() {
    const input = el('userInput');
    const text = input.value.trim();
    if (!text || AppState.isTyping) return;

    // UI Updates
    input.value = '';
    input.style.height = 'auto';
    el('welcomeScreen').style.display = 'none';
    
    // Add User Message
    addMessageToUI('user', text);
    scrollToBottom();

    // AI Processing
    AppState.isTyping = true;
    showTypingIndicator(true);

    try {
        const response = await fetchGroqCompletion(text);
        showTypingIndicator(false);
        addMessageToUI('bot', response);
    } catch (error) {
        showTypingIndicator(false);
        addMessageToUI('bot', "⚠️ Lo siento, hubo un error de conexión. Por favor intenta de nuevo.");
        console.error(error);
    }
    
    AppState.isTyping = false;
    scrollToBottom();
}

// 2. API Integration
async function fetchGroqCompletion(prompt) {
    // Simulated API Call (Replace with actual fetch)
    /*
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [{role: "user", content: prompt}],
            model: "llama3-70b-8192"
        })
    });
    */
    
    // Simulation for Demo
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`### Respuesta Simulada\nHe procesado tu solicitud: **"${prompt}"**.\n\nAquí tienes un ejemplo de código:\n\`\`\`javascript\nconsole.log("Hello World");\n\`\`\``);
        }, 1500);
    });
}

// 3. UI Renderers
function addMessageToUI(role, content) {
    const container = el('messagesList');
    const div = document.createElement('div');
    
    if (role === 'user') {
        div.className = 'flex justify-end animate-fade-in';
        div.innerHTML = `
            <div class="message-user p-4 text-white text-sm md:text-base shadow-lg">
                ${escapeHtml(content)}
            </div>
        `;
    } else {
        div.className = 'flex justify-start animate-fade-in w-full';
        const parsedContent = marked.parse(content);
        div.innerHTML = `
            <div class="flex gap-4 max-w-3xl w-full">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="prose prose-invert">
                        ${parsedContent}
                    </div>
                    <div class="mt-2 flex items-center gap-2">
                        <button class="text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1" onclick="copyToClipboard(this)">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                            Copiar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.appendChild(div);
    
    // Highlight Code Blocks
    div.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

function showTypingIndicator(show) {
    const indicator = el('typingIndicator');
    if (show) {
        indicator.classList.remove('hidden');
        indicator.classList.add('animate-fade-in');
    } else {
        indicator.classList.add('hidden');
    }
}

function scrollToBottom() {
    const chatContainer = el('chatContainer');
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
}

// --- UTILITIES ---
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function setInput(text) {
    const input = el('userInput');
    input.value = text;
    input.focus();
    // Auto-resize
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Send Button
    el('sendBtn').addEventListener('click', sendMessage);
    
    // Enter Key
    el('userInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Sidebar Toggles
    const toggleSidebar = () => {
        const sidebar = el('sidebar');
        const overlay = el('mobileOverlay');
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            sidebar.classList.remove('open');
            sidebar.classList.remove('translate-x-0'); // Mobile fix
            overlay.classList.remove('active');
            setTimeout(() => overlay.style.display = 'none', 300);
        } else {
            overlay.style.display = 'block';
            // Force reflow
            overlay.offsetHeight;
            sidebar.classList.add('open');
            sidebar.classList.add('translate-x-0'); // Mobile fix
            overlay.classList.add('active');
        }
    };

    el('toggleSidebar')?.addEventListener('click', toggleSidebar);
    el('closeSidebar')?.addEventListener('click', toggleSidebar);
    el('mobileOverlay')?.addEventListener('click', toggleSidebar);

    // Initial Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    
    console.log('LYRA AI Professional initialized', {
        version: '2.0.0-pro',
        firebase: !!app
    });
});

// Resize Handler
const handleResize = debounce(() => {
    if (window.innerWidth >= 768) {
        el('sidebar')?.classList.remove('open');
        el('mobileOverlay')?.classList.remove('active');
        el('mobileOverlay')?.style.setProperty('display', 'none');
    }
}, 250);

window.addEventListener('resize', handleResize);
