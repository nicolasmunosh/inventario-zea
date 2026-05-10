// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBrz30G49gZNLoSUgMLkX8rCvBmPo_h3VA",
  authDomain: "inventario-ja.firebaseapp.com",
  projectId: "inventario-ja",
  storageBucket: "inventario-ja.firebasestorage.app",
  messagingSenderId: "932552764949",
  appId: "1:932552764949:web:efcf7a7fd5fc02db5b281c",
  measurementId: "G-S79T24GPT3",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
