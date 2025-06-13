// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
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
import { getDatabase, ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const db = getDatabase();

async function encriptarContraseña(contraseña) {
    const encoder = new TextEncoder();
    const datos = encoder.encode(contraseña);
    const hashBuffer = await crypto.subtle.digest('SHA-256', datos);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function compararContraseña(contraseñaIngresada, contraseñaEncriptada) {
    const hash = await encriptarContraseña(contraseñaIngresada);
    return hash === contraseñaEncriptada;
}

async function validarCliente(id, usuario) {
    const clienteSnap = await get(ref(db, 'clientes/' + id));
    const usuarioSnap = await get(ref(db, 'usuarios/' + usuario));
    if (!clienteSnap.exists() && !usuarioSnap.exists()) {
        return { ok: true };
    }
    return {
        ok: false,
        error: "Cliente ya existe o correo ya registrado"
    };
}

export async function registrarUsuarios(id, datos) {
    const newClient = await validarCliente(id, datos.usuario);
    if (!newClient.ok) {
        return newClient
    }
    datos.password = await encriptarContraseña(datos.password);
    try {
        await set(ref(db, 'clientes/' + id), datos);
        await set(ref(db, 'usuarios/' + datos.usuario), datos.password);
        return { ok: true };
    } catch (error) {
        return { ok: false, error: error };
    }
}

export async function ingresoInicioSesion(user, password) {
    const usuarioSnap = await get(ref(db, 'usuarios/' + user));
    if (!usuarioSnap.exists()) {
        return {
            ok: false,
            error: "Usuario o contraseña inválida"
        };
    }
    const hashGuardado = usuarioSnap.val();
    const esValida = compararContraseña(password, hashGuardado);
    if (!esValida) {
        return {
            ok: false,
            error: "Usuario o contraseña inválida"
        };
    }
    return {
        ok: true
    };
}


export async function cambiarPass(id, newPass) {
    try {
        const newPassCodi = encriptarContraseña(newPass);
        await update(ref(db, 'clientes/' + id), { password: newPassCodi });
        const usuarioSnap = await get(ref(db, 'clientes/' + id + '/usuario'));
        const nombreUsuario = usuarioSnap.val();
        await update(ref(db, 'usuarios/' + nombreUsuario), newPassCodi);
        return {
            ok: true
        };
    } catch (error) {
        return {
            ok: false,
            error: error.message || error
        };
    }
}


export async function validarCredenciales(datos) {
    const clienteSnap = await get(ref(db, 'clientes/' + datos.documento));
    if (!clienteSnap.exists()){
        return {
            ok: false,
            error: "Datos incorrectos"
        }
    }
    if(clienteSnap.val().correo === datos.correo && clienteSnap.val().tipoIdentificacion === datos.tipoIdentificacion){
        return {
            ok: true
        }
    }
    return {
        ok:false,
        error: "Datos incorrectos 1"
    }
}