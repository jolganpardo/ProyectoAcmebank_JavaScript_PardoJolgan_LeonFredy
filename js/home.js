import {datosIniciar, desencriptarUser} from "./config/db.js";
var puntos = new Intl.NumberFormat('es-CO').format;
async function localGet() {
    const datos = JSON.parse(localStorage.getItem("datos"));
    const date = await desencriptarUser(datos);
    return date
}
function capitalizarCadaPalabra(frase) {
  return frase
    .split(' ')
    .map(palabra =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(' ');
}
async function cargarDatos() {
    const user = await localGet();
    
    if(!user){
        return window.location.href = "./index.html"
    }
    const datosUser = await datosIniciar(user.id);
    if (datosUser.ok){
        document.getElementById("userNombre").textContent = capitalizarCadaPalabra(datosUser.datos.nombre+" "+datosUser.datos.apellido+"👋👋");
        document.getElementById("userCuenta").textContent = datosUser.datos.cuenta;
        
        document.getElementById("userSaldo").textContent = "$ " +puntos(datosUser.datos.saldo);
    }
}
const btnLogOut = document.getElementById("log-out");

btnLogOut.addEventListener("click", () => {
        localStorage.removeItem("datos");
        location.reload();
})

document.addEventListener("DOMContentLoaded", cargarDatos);