// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Configuración de Firebase 
const firebaseConfig = {
    apiKey: "AIzaSyDh0WvGvQ9MCG5hdwTVNP91BMmOTL3LNkc",
    authDomain: "actividad-final-iw.firebaseapp.com",
    databaseURL: "https://actividad-final-iw-default-rtdb.firebaseio.com",
    projectId: "actividad-final-iw",
    storageBucket: "actividad-final-iw.firebasestorage.app",
    messagingSenderId: "775084595601",
    appId: "1:775084595601:web:0267405a56cd522f026230",
    measurementId: "G-JP4LVXYMDR"
  };

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
