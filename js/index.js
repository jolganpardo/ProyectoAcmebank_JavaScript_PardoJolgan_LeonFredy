import {ingresoInicioSesion} from "./config/db.js";
async function local(datos) {
    localStorage.setItem("datos",JSON.stringify(datos));    
}
async function validarEntradas() {
    
    const user = document.getElementById("ingresoUsuario").value;
    const pass = document.getElementById("ingresoPass").value;
    const respuestaIngreso = await ingresoInicioSesion(user, pass);
    if (!respuestaIngreso.ok){
        return alert(respuestaIngreso.error);
    }
    await local(respuestaIngreso.datos);
    window.location.href = "./home.html"
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("formulario-inicio-sesion").addEventListener("submit", (event) => {
        event.preventDefault(); 
        validarEntradas(); 
    });
});

const btnResgistrateAqui = document.getElementById("btn-registrate-aqui");
const btnOlvidarContraseña = document.getElementById("btn-cambiar-pass");
const pestRegistro = document.getElementById("pest-registro");
const pestCambiarCont = document.getElementById("pest-cambiar-contraseña");
const pestInicioSesion = document.getElementById("formulario-inicio-sesion");
const btnVolver = document.getElementById("btn-volver");

btnResgistrateAqui.addEventListener("click", () => {
    pestInicioSesion.style.display = "none";
    pestRegistro.style.display = "block";
    pestCambiarCont.style.display = "none";
    btnVolver.style.display = "block";
})

btnOlvidarContraseña.addEventListener("click", () => {
    pestInicioSesion.style.display = "none";
    pestRegistro.style.display = "none";
    pestCambiarCont.style.display = "block";
    btnVolver.style.display = "block";
})

btnVolver.addEventListener("click", () => {
    pestInicioSesion.style.display = "block";
    pestRegistro.style.display = "none";
    pestCambiarCont.style.display = "none";
    btnVolver.style.display = "none";
})