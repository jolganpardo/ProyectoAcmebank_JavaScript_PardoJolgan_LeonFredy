import {datosIniciar, desencriptarUser} from "./config/db.js";
var puntos = new Intl.NumberFormat('es-CO').format;
export async function localGet() {
    const datosStr = localStorage.getItem("datos");
    if (!datosStr) {
        return null;
    }
    const datos = JSON.parse(datosStr);
    const date = await desencriptarUser(datos);
    return date;
}
export function capitalizarCadaPalabra(frase) {
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
        const userNombreElem = document.getElementById("userNombre");
        const userCuentaElem = document.getElementById("userCuenta");
        const userSaldoElem = document.getElementById("userSaldo");

        if (userNombreElem) {
            userNombreElem.textContent = capitalizarCadaPalabra(datosUser.datos.nombre+" "+datosUser.datos.apellido+"👋👋");
        }
        if (userCuentaElem) {
            userCuentaElem.textContent = datosUser.datos.cuenta;
        }
        if (userSaldoElem) {
            userSaldoElem.textContent = "$ " +puntos(datosUser.datos.saldo);
        }
    }
}


document.addEventListener("DOMContentLoaded", ()=>{
    let btnLogOut = document.getElementById("log-out");

    if (btnLogOut) {
        btnLogOut.addEventListener("click", () => {
            localStorage.removeItem("datos");
            location.reload();
        });
    }
    cargarDatos()
});

const menuToggle = document.getElementById("menu-toggle");
const navegacion = document.getElementById("navegacion");

if (menuToggle && navegacion) {
    menuToggle.addEventListener("click", () => {
        navegacion.classList.toggle("activo");
        menuToggle.classList.toggle("abierto");
    });

    const enlacesNav = navegacion.querySelectorAll("a");
    enlacesNav.forEach((enlace) => {
        enlace.addEventListener("click", () => {
            navegacion.classList.remove("activo");
            menuToggle.classList.remove("abierto");
        });
    });
}
