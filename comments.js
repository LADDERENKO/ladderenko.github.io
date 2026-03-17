import { auth, rdb, db } from "./firebase-config.js";
import { ref, push, onValue, serverTimestamp, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const ADMIN_UID = "hs1iFcs2bOObNQrU4kKeC3qxXCp2";
const chatKey = window.location.pathname.split('/').pop().replace('.html', '') || 'main';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('comments-section');
    if (!container) return;

    container.innerHTML = `
        <div class="chat-container" style="border: 1px solid #FF0055; padding: 15px; background: rgba(0,0,0,0.7);">
            <div style="display:flex; justify-content:space-between;">
                <h3 style="color:#00FFFF; font-family:'Michroma'; font-size:0.8em;">ЧАТ: ${chatKey.toUpperCase()}</h3>
                <button id="clear-btn" style="display:none; color:#FF0055; background:none; border:1px solid #FF0055; cursor:pointer; font-size:0.5em;">ОЧИСТИТЬ</button>
            </div>
            <div id="msg-box" style="height:300px; overflow-y:auto; padding:10px; margin:10px 0; border-bottom:1px solid #1A2B3A;"></div>
            <div id="input-area" style="display:none; gap:5px;">
                <input type="text" id="m-in" class="auth-input" style="margin:0!important;" placeholder="Текст...">
                <button id="m-send" class="auth-btn" style="width:auto; padding:0 20px;">></button>
            </div>
        </div>
    `;

    const msgBox = document.getElementById('msg-box');
    const input = document.getElementById('m-in');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('input-area').style.display = 'flex';
            if (user.uid === ADMIN_UID) document.getElementById('clear-btn').style.display = 'block';
        }
    });

    onValue(ref(rdb, `chats/${chatKey}`), (snap) => {
        msgBox.innerHTML = '';
        snap.forEach(child => {
            const m = child.val();
            const isAdm = m.uid === ADMIN_UID;
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            div.innerHTML = `
                <span style="border:1px solid ${isAdm ? '#FFD700' : m.color}; color:${isAdm ? '#FFD700' : m.color}; font-size:0.6em; padding:1px 4px;">${m.badge}</span>
                <b style="color:${isAdm ? '#FFD700' : '#E6F0FF'}; ${isAdm ? 'text-shadow:0 0 8px #FFD700;' : ''}">${m.name}:</b>
                <span style="color:${isAdm ? '#FFFACD' : '#A0C0FF'};">${m.text}</span>
            `;
            msgBox.appendChild(div);
        });
        msgBox.scrollTop = msgBox.scrollHeight;
    });

    document.getElementById('m-send').onclick = async () => {
        const u = auth.currentUser;
        if (!input.value.trim() || !u) return;
        const d = await getDoc(doc(db, "users", u.uid));
        const data = d.exists() ? d.data() : {};
        await push(ref(rdb, `chats/${chatKey}`), {
            uid: u.uid,
            name: data.nickname || "Адепт",
            badge: data.badgeText || "АДЕПТ",
            color: data.badgeColor || "#00FFFF",
            text: input.value,
            timestamp: serverTimestamp()
        });
        input.value = '';
    };

    document.getElementById('clear-btn').onclick = () => { if(confirm("Снести чат?")) remove(ref(rdb, `chats/${chatKey}`)); };
});
