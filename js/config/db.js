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

export async function encriptarDatos(datos, claveSecreta) {
    const encoder = new TextEncoder();
    const datosCodificados = encoder.encode(datos);

    let claveCodificada; // <- Declaración afuera del try

    try {
        claveCodificada = await crypto.subtle.importKey(
            "raw",
            encoder.encode(claveSecreta),
            { name: "AES-GCM" },
            false,
            ["encrypt"]
        );
    } catch (error) {
        alert("Error al importar clave: " + error.message);
        return; // Cortar ejecución si falla
    }

    const iv = crypto.getRandomValues(new Uint8Array(12)); // correcto

    try {
        const datosEncriptados = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            claveCodificada,
            datosCodificados
        );

        return {
            iv: Array.from(iv),
            datos: Array.from(new Uint8Array(datosEncriptados))
        };
    } catch (error) {
        alert("💥 Error en encrypt: " + error.message);
        console.error(error);
    }
}

export async function desencriptarDatos(encriptado, claveSecreta) {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    let claveCodificada;

    try {
        claveCodificada = await crypto.subtle.importKey(
            "raw",
            encoder.encode(claveSecreta),
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );
    } catch (error) {
        alert("Error al importar clave para desencriptar: " + error.message);
        return;
    }

    try {
        const iv = new Uint8Array(encriptado.iv);
        const datosEncriptados = new Uint8Array(encriptado.datos);

        const datosDescifrados = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            claveCodificada,
            datosEncriptados
        );

        return decoder.decode(datosDescifrados);
    } catch (error) {
        alert("💥 Error al desencriptar: " + error.message);
        console.error(error);
    }
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
    datos.saldo = 0;
    datos.password = await encriptarContraseña(datos.password);
    try {
        await set(ref(db, 'clientes/' + id), datos);
        await set(ref(db, 'usuarios/' + datos.usuario), { pass: datos.password, id: id });
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
    const datos = usuarioSnap.val();
    const hashGuardado = datos.pass;
    const id = datos.id;

    const esValida = await compararContraseña(password, hashGuardado);
    if (!esValida) {
        return {
            ok: false,
            error: "Usuario o contraseña inválida"
        };
    }
    return {
        ok: true,
        datos: {
            usuario: user,
            id: id
        }
    };
}


export async function cambiarPass(id, newPass) {
    try {
        const newPassCodi = await encriptarContraseña(newPass);
        await update(ref(db, 'clientes/' + id), { password: newPassCodi });
        const usuarioSnap = await get(ref(db, 'clientes/' + id + '/usuario'));
        const nombreUsuario = usuarioSnap.val();
        await update(ref(db, 'usuarios/' + nombreUsuario), { pass: newPassCodi });
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
    if (!clienteSnap.exists()) {
        return {
            ok: false,
            error: "Datos incorrectos"
        }
    }
    if (clienteSnap.val().correo === datos.correo && clienteSnap.val().tipoIdentificacion === datos.tipoIdentificacion) {
        return {
            ok: true
        }
    }
    return {
        ok: false,
        error: "Datos incorrectos 1"
    }
}

export async function datosIniciar(id) {
    try {
        const usuarioSnap = await get(ref(db, 'clientes/' + id));
        const datos = usuarioSnap.val();
        const saldo = datos.saldo ? datos.saldo : 0;
        return {
            ok: true,
            datos: {
                cuenta: datos.cuenta,
                saldo: saldo,
                nombre: datos.nombre,
                apellido: datos.apellido
            }
        };
    } catch (error) {
        return {
            ok: false,
            error: error.message || error
        };
    }

}

// export async function encriptarUser(user, id) {
//     const userInc = await encriptarContraseña(user);
//     const idInc = await encriptarContraseña(id);
//     console.log(userInc, idInc);
//     return {usuario: userInc, id: idInc}
// }
const claveSecreta = "!#$%&/1234567890"; // 16 caracteres (128 bits)


export async function encriptarUser(user, id) {


    const userEnc = await encriptarDatos(user, claveSecreta);
    const idEnc = await encriptarDatos(id, claveSecreta);

    console.log("Usuario encriptado:", userEnc);
    console.log("ID encriptado:", idEnc);

    return {
        usuario: userEnc,
        id: idEnc
    };
}

export async function desencriptarUser(encryptedUserData) {

    const user = await desencriptarDatos(encryptedUserData.usuario, claveSecreta);
    const id = await desencriptarDatos(encryptedUserData.id, claveSecreta);

    console.log("Usuario desencriptado:", user);
    console.log("ID desencriptado:", id);

    return {
        usuario: user,
        id: id
    };
}
