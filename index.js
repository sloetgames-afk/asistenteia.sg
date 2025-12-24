import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = { /* Tus credenciales de Firebase */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 1. Función para enviar mensaje y crear chat
async function sendMessage(text) {
    const user = auth.currentUser;
    if (!user) return;

    // Si es el primer mensaje, podrías crear un documento de "Chat" primero
    const chatRef = await addDoc(collection(db, "chats"), {
        userId: user.uid,
        title: text.substring(0, 20),
        createdAt: serverTimestamp()
    });

    // Guardar el mensaje
    await addDoc(collection(db, "chats", chatRef.id, "messages"), {
        text: text,
        sender: "user",
        createdAt: serverTimestamp()
    });
}

// 2. Cambio de Tema (Local)
const themeSelector = document.getElementById('theme-selector');
themeSelector.addEventListener('change', (e) => {
    document.body.className = e.target.value === 'dark' ? 'dark-theme' : 'light-theme';
});
