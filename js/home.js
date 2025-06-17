import {datosIniciar, desencriptarUser, cargarMovimientos} from "./config/db.js";
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
export async function cargarDatos() {
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
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    let horas = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const ampm = horas >= 12 ? 'p.m.' : 'a.m.';

    horas = horas % 12 || 12; // Formato 12 horas
    const horaFormateada = String(horas).padStart(2, '0');

    return `${año}/${mes}/${dia}`;
}


async function mostrarHistorialInicial() {
    const datos = await localGet();
    const id = datos.id;

    const movimientosSnap = await cargarMovimientos(id);

    if(!movimientosSnap.ok){
        return alert("No se cargaron datos")
    }
    const movimientos = [];
    const retirosSnap = movimientosSnap.retiros;
    const consignacionesSnap = movimientosSnap.consignaciones;
    if (retirosSnap.exists()) {
        Object.values(retirosSnap.val()).forEach(mov => movimientos.push(mov));
    }
    if (consignacionesSnap.exists()) {
        Object.values(consignacionesSnap.val()).forEach(mov => movimientos.push(mov));
    }

    // Ordenar por fecha descendente
    movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Tomar solo los primeros 10
    const ultimos = movimientos.slice(0, 10);

    const contenedor = document.querySelector(".transactions-container");
    const template = document.getElementById("transaction-item-template");

    // Limpiar historial previo
    // contenedor.innerHTML = "";

    ultimos.forEach(mov => {
        const clon = template.content.cloneNode(true);

        clon.querySelector(".transaction-date").textContent = "🗓 " + formatearFecha(mov.fecha);
        clon.querySelector(".transaction-amount").textContent = (mov.tipo === "Retiro" ? "-$" : "+$") + puntos(mov.valor);
        clon.querySelector(".transaction-amount").classList.add(mov.tipo === "Retiro" ? "negative" : "positive");
        clon.querySelector(".transaction-type").textContent = mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1);
        clon.querySelector(".transaction-type").classList.add(mov.tipo.toLowerCase());
        clon.querySelector(".transaction-ref").textContent = "REF: " + mov.referencia;
        clon.querySelector(".transaction-desc").textContent = mov.descripcion;

        contenedor.appendChild(clon);
    });
}

document.addEventListener("DOMContentLoaded", ()=>{
    window.addEventListener("message", (event) => {
        if (event.data?.tipo === "consignacionExitosa" && event.data?.movimiento) {
            actualizarUltimoMovimiento(event.data.movimiento);
            cargarDatos(); 
        }
    });
    let btnLogOut = document.getElementById("log-out");

    if (btnLogOut) {
        btnLogOut.addEventListener("click", () => {
            localStorage.removeItem("datos");
            location.reload();
        });
    }
    mostrarHistorialInicial();
    cargarDatos()

});

