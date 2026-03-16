import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYX2Lr_OKT2yfqZCV5IYjNOZ2Bp4bZDRY",
    authDomain: "ladder-aab8a.firebaseapp.com",
    databaseURL: "https://ladder-aab8a-default-rtdb.firebaseio.com/",
    projectId: "ladder-aab8a",
    appId: "1:558510161712:web:5e35ea602eeae4afb3d2f5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const rdb = getDatabase(app);
const db = getFirestore(app);

// Определяем ID чата. Если это главная — будет 'main', если статья — её имя.
const path = window.location.pathname.split('/').pop().replace('.html', '');
const chatKey = path === 'index' || path === '' ? 'main' : path;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('comments-section');
    if (!container) return;

    container.innerHTML = `
        <div class="chat-container" style="margin-top: 50px; border: 1px solid #FF0055; padding: 20px; background: rgba(0,0,0,0.5); border-radius: 10px;">
            <h3 style="color: #00FFFF; font-family: 'Michroma'; text-shadow: 0 0 10px #00FFFF;">ЧАТ АДЕПТОВ [${chatKey.toUpperCase()}]</h3>
            <div id="chat-messages" style="height: 350px; overflow-y: auto; margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #1A2B3A;">
                <p style="color: #5a5a72;">Связь с сервером...</p>
            </div>
            <div id="chat-controls" style="display: none; gap: 10px;">
                <input type="text" id="chat-input" class="auth-input" placeholder="Введите ваше сообщение..." style="flex-grow: 1;">
                <button id="chat-send" class="cta-button" style="padding: 10px 20px;">ОТПРАВИТЬ</button>
            </div>
            <div id="chat-lock" style="color: #FF0055; font-size: 0.8em; text-align: center;">
                ВОЙДИТЕ В АККАУНТ, ЧТОБЫ ПИСАТЬ СООБЩЕНИЯ
            </div>
        </div>
    `;

    const msgBox = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    // Получаем данные юзера (ник и плашку)
    let userProfile = null;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            userProfile = userDoc.exists() ? userDoc.data() : { nickname: "Аноним" };
            document.getElementById('chat-controls').style.display = 'flex';
            document.getElementById('chat-lock').style.display = 'none';
        }
    });

    // Загрузка сообщений
    onValue(ref(rdb, `chats/${chatKey}`), (snapshot) => {
        msgBox.innerHTML = '';
        if (!snapshot.exists()) {
            msgBox.innerHTML = '<p style="color: #5a5a72;">Сообщений нет. Стань первым!</p>';
            return;
        }
        snapshot.forEach(child => {
            const m = child.val();
            const div = document.createElement('div');
            div.style.marginBottom = '8px';
            div.innerHTML = `
                <span style="color: ${m.color || '#00FF80'}; font-size: 0.7em; border: 1px solid; padding: 1px 4px; margin-right: 5px;">${m.badge || 'АДЕПТ'}</span>
                <b style="color: #E6F0FF;">${m.name}:</b> 
                <span style="color: #A0C0FF;">${m.text}</span>
            `;
            msgBox.appendChild(div);
        });
        msgBox.scrollTop = msgBox.scrollHeight;
    });

    // Отправка
    const doSend = async () => {
        const text = input.value.trim();
        if (!text || !userProfile) return;
        await push(ref(rdb, `chats/${chatKey}`), {
            name: userProfile.nickname || "Аноним",
            badge: userProfile.badgeText || "АДЕПТ",
            color: userProfile.badgeColor || "#00FFFF",
            text: text,
            timestamp: serverTimestamp()
        });
        input.value = '';
    };

    sendBtn.onclick = doSend;
    input.onkeypress = (e) => { if(e.key === 'Enter') doSend(); };
});