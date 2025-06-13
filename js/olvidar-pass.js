import { cambiarPass, validarCredenciales } from "./config/db.js"
var datos;
async function datosFormulario() {
    datos = {
        tipoIdentificacion: document.getElementById("tipoIdentificacionOlvidarPass").value,
        documento: document.getElementById("documentoOlvidarPass").value,
        correo: document.getElementById("correoOlvidarPass").value
    }
    const resputaValidar = await validarCredenciales(datos);
    if (!resputaValidar.ok) {
        alert(resputaValidar.error);
        return
    }
    document.getElementById("formulario-olvidar-pass").classList.toggle("ocultar");
    document.getElementById("formulario-cambio-paas").classList.toggle("ocultar");
}

function devolverAtras(){
    document.getElementById("formulario-olvidar-pass").classList.toggle("ocultar");
    document.getElementById("formulario-cambio-paas").classList.toggle("ocultar");
}

async function validarContrasena(){
    const passwordNew = document.getElementById("passwordNew").value;
    const passwordVerificacionNew = document.getElementById("passwordVerificacionNew").value;
    if (passwordVerificacionNew !== passwordNew){
        alert("Contraseñas no coinciden");
    }
    const respuestCambioPass =  await cambiarPass(datos.cedula, passwordNew);
    if (!respuestCambioPass.ok){
        alert("No se pudo hacer cambio de contraseña")
        return
    }
    alert("Cambio Exitoso");
    document.getElementById("formulario-cambio-paas").reset();
    document.getElementById("formulario-olvidar-pass").reset();
    devolverAtras();

}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-olvido-pass-verificar").addEventListener("submit", (event)=>{
        event.preventDefault();
        datosFormulario();
    });
    document.getElementById("btn-atras-olvido-pass").addEventListener("click", devolverAtras);
    document.getElementById("btn-cambio-pass").addEventListener("submit", (event)=>{
        event.preventDefault();
        validarContrasena();
    });
})