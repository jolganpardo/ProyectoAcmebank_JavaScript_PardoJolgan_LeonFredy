// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1Y3_U_V-_PttKMNErHfM6kHxuNTF7Gfo",
  authDomain: "acme-bank-45072.firebaseapp.com",
  databaseURL: "https://acme-bank-45072-default-rtdb.firebaseio.com",
  projectId: "acme-bank-45072",
  storageBucket: "acme-bank-45072.firebasestorage.app",
  messagingSenderId: "34938869124",
  appId: "1:34938869124:web:536e42a83f6ae028def9d1",
  measurementId: "G-HVDFM5EJN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import {getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const db = getDatabase();
 
export function registrarUsuarios (id, datos){
    set(ref(db, 'cliente/'+id),datos)
    .then(()=>{
        alert("Usuarios Registrados");
    })
    .catch((error)=>{
        alert("Usuario no registrado")
        console.log(error);
    })
}