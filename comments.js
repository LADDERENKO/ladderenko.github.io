import { auth, rdb, db } from "./firebase-config.js";
import { ref, push, onValue, serverTimestamp, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const path = window.location.pathname.split('/').pop().replace('.html', '');
const chatKey = (path === 'index' || path === '') ? 'main' : path;

// ТВОЙ UID УСПЕШНО ИНТЕГРИРОВАН
const ADMIN_UID = "hs1iFcs2bOObNQrU4kKeC3qxXCp2"; 

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('comments-section');
    if (!container) return;

    container.innerHTML = `
        <div class="chat-container" style="margin-top: 50px; border: 1px solid #FF0055; padding: 20px; background: rgba(0,0,0,0.5); border-radius: 10px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="color: #00FFFF; font-family: 'Michroma'; text-shadow: 0 0 10px #00FFFF; margin: 0;">ЧАТ АДЕПТОВ [${chatKey.toUpperCase()}]</h3>
                <button id="clear-chat-btn" style="display: none; background: rgba(255, 0, 85, 0.2); border: 1px solid #FF0055; color: #FF0055; font-size: 0.6em; cursor: pointer; padding: 5px 10px; font-family: 'Michroma';">ОЧИСТИТЬ ВСЁ</button>
            </div>
            
            <div id="chat-messages" style="height: 350px; overflow-y: auto; margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #1A2B3A; scroll-behavior: smooth;">
                <p style="color: #5a5a72;">Синхронизация с сервером...</p>
            </div>
            
            <div id="chat-controls" style="display: none; gap: 10px;">
                <input type="text" id="chat-input" class="auth-input" placeholder="Введите ваше сообщение..." style="flex-grow: 1;">
                <button id="chat-send" class="cta-button" style="padding: 10px 20px;">ОТПРАВИТЬ</button>
            </div>
            <div id="chat-lock" style="color: #FF0055; font-size: 0.8em; text-align: center;">
                ТРЕБУЕТСЯ АВТОРИЗАЦИЯ ДЛЯ ДОСТУПА К КАНАЛУ
            </div>
        </div>
    `;

    const msgBox = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const clearBtn = document.getElementById('clear-chat-btn');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('chat-controls').style.display = 'flex';
            document.getElementById('chat-lock').style.display = 'none';
            // Показываем кнопку очистки только админу
            if (user.uid === ADMIN_UID) {
                clearBtn.style.display = 'block';
            }
        }
    });

    onValue(ref(rdb, `chats/${chatKey}`), (snapshot) => {
        msgBox.innerHTML = '';
        if (!snapshot.exists()) {
            msgBox.innerHTML = '<p style="color: #5a5a72; text-align: center; margin-top: 20px;">ПРОТОКОЛ ЧИСТ. СООБЩЕНИЙ НЕТ.</p>';
            return;
        }
        snapshot.forEach(child => {
            const m = child.val();
            const div = document.createElement('div');
            
            const isGold = (m.uid === ADMIN_UID);
            
            // Стилизация золотого сообщения
            const nameColor = isGold ? '#FFD700' : (m.color || '#00FF80');
            const textColor = isGold ? '#FFFACD' : '#A0C0FF';
            const shadow = isGold ? 'text-shadow: 0 0 12px rgba(255, 215, 0, 0.8);' : '';
            const border = isGold ? 'border: 1px solid #FFD700; background: rgba(255, 215, 0, 0.15);' : `border: 1px solid ${m.color || '#00FF80'};`;

            div.style.cssText = `margin-bottom: 12px; padding: 8px; border-radius: 5px; ${isGold ? 'background: rgba(255,215,0,0.05); border-left: 3px solid #FFD700;' : ''}`;
            
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="${border} color: ${nameColor}; font-size: 0.6em; padding: 1px 6px; font-weight: bold; text-transform: uppercase; border-radius: 3px;">
                        ${m.badge || 'АДЕПТ'}
                    </span>
                    <b style="color: ${nameColor}; ${shadow} font-size: 0.9em;">${m.name}</b>
                </div>
                <div style="color: ${textColor}; ${shadow} font-size: 0.95em; padding-left: 5px; line-height: 1.4;">
                    ${m.text}
                </div>
            `;
            msgBox.appendChild(div);
        });
        msgBox.scrollTop = msgBox.scrollHeight;
    });

    const doSend = async () => {
        const text = input.value.trim();
        const user = auth.currentUser;
        if (!text || !user) return;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            
            await push(ref(rdb, `chats/${chatKey}`), {
                uid: user.uid,
                name: userData.nickname || "Аноним",
                badge: userData.badgeText || "АДЕПТ",
                color: userData.badgeColor || "#00FFFF",
                text: text,
                timestamp: serverTimestamp()
            });
            input.value = '';
        } catch (e) { console.error("ОШИБКА ПЕРЕДАЧИ:", e); }
    };

    // Очистка чата
    clearBtn.onclick = async () => {
        if (confirm("УДАЛИТЬ ВСЮ ИСТОРИЮ ЭТОГО ЧАТА?")) {
            await remove(ref(rdb, `chats/${chatKey}`));
        }
    };

    sendBtn.onclick = doSend;
    input.onkeypress = (e) => { if(e.key === 'Enter') doSend(); };
});
