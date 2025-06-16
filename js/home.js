import {datosIniciar} from "./config/db.js";
var puntos = new Intl.NumberFormat('es-CO').format;
async function localGet() {
    return JSON.parse(localStorage.getItem("datos"));

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
    console.log(user)
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

document.addEventListener("DOMContentLoaded", cargarDatos);