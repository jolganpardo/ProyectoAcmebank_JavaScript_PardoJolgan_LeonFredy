import {ingresoInicioSesion} from "./config/db.js";
async function validarEntradas() {
    
    const user = document.getElementById("ingresoUsuario").value;
    const pass = document.getElementById("ingresoPass").value;
    const respuestaIngreso = await ingresoInicioSesion(user, pass);
    if (!respuestaIngreso.ok){
        return alert(respuestaIngreso.error);
    }
    alert("Ingreso Exitoso")
}
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario-inicio-sesion");

    formulario.addEventListener("click", event => {
        event.preventDefault(); 
        alert("Formulario enviado");
        validarEntradas(); 
    });
});
