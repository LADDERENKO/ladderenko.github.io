import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYX2Lr_OKT2yfqZCV5IYjNOZ2Bp4bZDRY",
    authDomain: "ladder-aab8a.firebaseapp.com",
    databaseURL: "https://ladder-aab8a-default-rtdb.firebaseio.com/",
    projectId: "ladder-aab8a",
    appId: "1:558510161712:web:5e35ea602eeae4afb3d2f5"
};

// Проверяем, инициализировано ли уже приложение, чтобы не было ошибки [DEFAULT]
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const rdb = getDatabase(app);

export { auth, db, rdb };