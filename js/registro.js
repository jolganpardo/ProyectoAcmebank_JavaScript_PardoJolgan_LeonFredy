import { registrarUsuarios } from "./config/db.js";

function generarNumeroCuenta(cedula) {
    let primerosDigitos = cedula.toString().slice(0, 4);


    let ahora = new Date();
    let año = ahora.getFullYear(); // yyyy
    let mes = String(ahora.getMonth() + 1).padStart(2, '0');
    let dia = String(ahora.getDate()).padStart(2, '0');
    let hora = String(ahora.getHours()).padStart(2, '0');
    let minutos = String(ahora.getMinutes()).padStart(2, '0');
    let segundos = String(ahora.getSeconds()).padStart(2, '0');

    let fechaCompleta = `${año}${mes}${dia}${hora}${minutos}${segundos}`;
    let numeroCuenta = primerosDigitos + fechaCompleta;

    return numeroCuenta;
}

async function validarDatosResgistroUsuario() {
    const contra = document.getElementById("password").value
    const contraVeri = document.getElementById("passwordVerificacion").value
    if (contra !== contraVeri) {
        alert("Contraseña no coinciden")
        return
    }
    const datos = {
        nombre: document.getElementById("nombre").value,
        usuario: document.getElementById("correo").value.split("@")[0],
        apellido: document.getElementById("apellido").value,
        cuenta: generarNumeroCuenta(document.getElementById("documento").value),
        tipoIdentificacion: document.getElementById("tipoIdentificacion").value,
        documento: document.getElementById("documento").value,
        genero: document.getElementById("genero").value,
        celular: document.getElementById("celular").value,
        correo: document.getElementById("correo").value,
        ciudad: document.getElementById("ciudad").value,
        password: document.getElementById("password").value,
        direccion: document.getElementById("direccion").value,
        movimientos: []
    };
    const respuesta = await registrarUsuarios(document.getElementById("documento").value, datos);
    if (respuesta.ok) {
        alert("Usuario: " + datos.usuario + " \n N° cuenta: " + datos.cuenta)
        document.getElementById("formulario-registro").reset();

    } else {
        alert("Error en el registro: " + respuesta.error);
    };

}

document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("formulario-registro");

    formRegistro.addEventListener("submit", (event) => {
        event.preventDefault();
        validarDatosResgistroUsuario();
    });
})