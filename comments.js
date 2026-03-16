import { auth, rdb, db } from "./firebase-config.js";
import { ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Определяем, на какой мы странице
const path = window.location.pathname.split('/').pop().replace('.html', '');
const chatKey = (path === 'index' || path === '') ? 'main' : path;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('comments-section');
    if (!container) return;

    container.innerHTML = `
        <div class="chat-container" style="margin-top: 50px; border: 1px solid #FF0055; padding: 20px; background: rgba(0,0,0,0.5); border-radius: 10px;">
            <h3 style="color: #00FFFF; font-family: 'Michroma'; text-shadow: 0 0 10px #00FFFF;">ОБСУЖДЕНИЕ [${chatKey.toUpperCase()}]</h3>
            <div id="chat-messages" style="height: 350px; overflow-y: auto; margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #1A2B3A; font-family: 'Space Mono', monospace;">
                <p style="color: #5a5a72;">Подключение к матрице...</p>
            </div>
            <div id="chat-controls" style="display: none; gap: 10px;">
                <input type="text" id="chat-input" class="auth-input" placeholder="Твое мнение, адепт..." style="flex-grow: 1;">
                <button id="chat-send" class="cta-button" style="padding: 10px 20px;">ОТПРАВИТЬ</button>
            </div>
            <div id="chat-lock" style="color: #FF0055; font-size: 0.8em; text-align: center;">
                ТОЛЬКО АДЕПТЫ МОГУТ ПИСАТЬ. ВОЙДИ В СИСТЕМУ!
            </div>
        </div>
    `;

    const msgBox = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    let userProfile = null;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            userProfile = userDoc.exists() ? userDoc.data() : { nickname: "Аноним" };
            document.getElementById('chat-controls').style.display = 'flex';
            document.getElementById('chat-lock').style.display = 'none';
        }
    });

    // Слушаем базу
    onValue(ref(rdb, `chats/${chatKey}`), (snapshot) => {
        msgBox.innerHTML = '';
        if (!snapshot.exists()) {
            msgBox.innerHTML = '<p style="color: #5a5a72;">Тишина... Будь первым!</p>';
            return;
        }
        snapshot.forEach(child => {
            const m = child.val();
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            div.innerHTML = `
                <span style="color: ${m.color || '#00FFFF'}; border: 1px solid; padding: 2px 5px; font-size: 0.7em; margin-right: 8px;">${m.badge || 'АДЕПТ'}</span>
                <b style="color: #E6F0FF;">${m.name}:</b> 
                <span style="color: #A0C0FF;">${m.text}</span>
            `;
            msgBox.appendChild(div);
        });
        msgBox.scrollTop = msgBox.scrollHeight;
    });

    const sendMessage = async () => {
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

    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
});