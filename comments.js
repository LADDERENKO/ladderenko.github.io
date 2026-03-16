import { auth, rdb, db } from "./firebase-config.js";
import { ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const path = window.location.pathname.split('/').pop().replace('.html', '');
const chatKey = (path === 'index' || path === '') ? 'main' : path;

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

    // Проверка авторизации и отображение контроллов
    onAuthStateChanged(auth, (user) => {
        const controls = document.getElementById('chat-controls');
        const lock = document.getElementById('chat-lock');
        if (user) {
            if (controls) controls.style.display = 'flex';
            if (lock) lock.style.display = 'none';
        } else {
            if (controls) controls.style.display = 'none';
            if (lock) lock.style.display = 'block';
        }
    });

    // Получение сообщений из Realtime Database
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

    // Функция отправки сообщения
    const doSend = async () => {
        const text = input.value.trim();
        const user = auth.currentUser;

        if (!text || !user) return;

        try {
            // Прямо перед отправкой лезем в Firestore за самым свежим ником
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            
            const finalName = userData.nickname || "Аноним";
            const finalBadge = userData.badgeText || "АДЕПТ";
            const finalColor = userData.badgeColor || "#00FFFF";

            await push(ref(rdb, `chats/${chatKey}`), {
                name: finalName,
                badge: finalBadge,
                color: finalColor,
                text: text,
                timestamp: serverTimestamp()
            });
            
            input.value = '';
        } catch (e) {
            console.error("Ошибка отправки:", e);
        }
    };

    sendBtn.onclick = doSend;
    input.onkeypress = (e) => { if(e.key === 'Enter') doSend(); };
});
